import crypto from 'crypto';
import { getDatabase } from './mongodb';
import { User } from './types';

export async function hashPassword(password: string): Promise<string> {
  return crypto
    .pbkdf2Sync(password, process.env.SALT_SECRET || 'salt', 1000, 64, 'sha512')
    .toString('hex');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashOfInput = await hashPassword(password);
  return hashOfInput === hash;
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
  verificationToken: string,
  age?: number,
  role: 'user' | 'admin' = 'user'
): Promise<User> {
  const db = await getDatabase();

  const user = {
    name,
    email: email.toLowerCase(),
    passwordHash,
    isVerified: false,
    verificationToken,
    verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    otpCode: null,
    otpExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    role,
    roles: [role],
    age,
    profile: {
      age,
    },
  };

  const result = await db.collection('users').insertOne(user);
  return { ...user, _id: result.insertedId.toString() };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  return db.collection('users').findOne({ email: email.toLowerCase() }) as Promise<User | null>;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDatabase();
  const { ObjectId } = await import('mongodb');
  return db.collection('users').findOne({ _id: new ObjectId(id) }) as Promise<User | null>;
}

export async function verifyUserEmail(email: string, token: string): Promise<boolean> {
  const db = await getDatabase();
  const user = await getUserByEmail(email);

  if (!user || user.verificationToken !== token) {
    return false;
  }

  if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
    return false;
  }

  await db.collection('users').updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
        updatedAt: new Date(),
      },
    }
  );

  return true;
}

export async function generateAndStoreOTP(email: string): Promise<string> {
  const db = await getDatabase();
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.collection('users').updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        otpCode: otp,
        otpExpiry,
        updatedAt: new Date(),
      },
    }
  );

  return otp;
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const db = await getDatabase();
  const user = await getUserByEmail(email);

  if (!user || user.otpCode !== otp) {
    return false;
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    return false;
  }

  await db.collection('users').updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        isVerified: true,
        otpCode: null,
        otpExpiry: null,
        updatedAt: new Date(),
      },
    }
  );

  return true;
}

export async function makeUserAdmin(email: string): Promise<void> {
  const db = await getDatabase();
  await db.collection('users').updateOne(
    { email: email.toLowerCase() },
    { $set: { role: 'admin', updatedAt: new Date() } }
  );
}
