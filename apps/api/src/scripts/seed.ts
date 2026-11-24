import { faker } from '@faker-js/faker';
import {
  SPECIALIZATIONS,
  type Gender,
  type PatientCondition,
  type Specialization,
} from '@doctor-tracker/shared';
import { env, isProduction } from '../config/env.js';
import { connectDb, disconnectDb } from '../db/connect.js';
import { syncAllIndexes } from '../db/indexes.js';
import { hashPassword } from '../lib/password.js';
import { Doctor } from '../models/doctor.model.js';
import { Patient } from '../models/patient.model.js';
import { User } from '../models/user.model.js';

const DOCTOR_COUNT = 60;
const PATIENT_COUNT = 1800;
const TREND_MONTHS = 12;

const HOSPITALS = [
  'Dhaka Medical College Hospital',
  'Square Hospitals Ltd.',
  'Evercare Hospital Dhaka',
  'United Hospital',
  'Labaid Specialized Hospital',
  'Ibn Sina Hospital',
  'Chattogram Medical College Hospital',
  'Popular Medical College Hospital',
];

interface NameGroup {
  male: string[];
  female: string[];
  last: string[];
  femaleLast?: string[];
}

const NAME_GROUPS: { weight: number; value: NameGroup }[] = [
  {
    weight: 88,
    value: {
      male: [
        'Rahim',
        'Karim',
        'Tanvir',
        'Arif',
        'Sabbir',
        'Mahmud',
        'Rafiq',
        'Imran',
        'Shakil',
        'Nayeem',
        'Fahim',
        'Rakib',
        'Sajid',
        'Mehedi',
        'Tahmid',
        'Ashraf',
        'Jahid',
        'Kamrul',
        'Mizanur',
        'Shahriar',
        'Zubair',
        'Anisur',
        'Habib',
        'Saiful',
        'Farhan',
        'Rashed',
        'Masud',
        'Tareq',
        'Asif',
        'Nafis',
      ],
      female: [
        'Nusrat',
        'Farzana',
        'Ayesha',
        'Sadia',
        'Tasnim',
        'Rumana',
        'Shirin',
        'Mahbuba',
        'Jannat',
        'Sumaiya',
        'Fatema',
        'Nasrin',
        'Sharmin',
        'Tahmina',
        'Lamia',
        'Afsana',
        'Rokeya',
        'Sabina',
        'Nazia',
        'Mehnaz',
        'Anika',
        'Raisa',
        'Tanjila',
        'Shamima',
        'Israt',
        'Moushumi',
        'Rehana',
        'Samira',
        'Fariha',
        'Nabila',
      ],
      last: [
        'Rahman',
        'Hossain',
        'Ahmed',
        'Chowdhury',
        'Islam',
        'Uddin',
        'Khan',
        'Sarker',
        'Talukder',
        'Miah',
        'Bhuiyan',
        'Siddique',
        'Haque',
        'Alam',
        'Majumder',
        'Mondal',
        'Sheikh',
        'Kabir',
        'Rashid',
        'Karim',
      ],
      femaleLast: ['Akter', 'Begum', 'Sultana', 'Khatun'],
    },
  },
  {
    weight: 12,
    value: {
      male: ['Sourav', 'Arnab', 'Pritom', 'Subrata', 'Anik', 'Dipankar', 'Shuvo', 'Tapas'],
      female: ['Ananya', 'Priya', 'Mitu', 'Shreya', 'Puja', 'Mousumi', 'Rupa', 'Tanushree'],
      last: ['Das', 'Roy', 'Saha', 'Dey', 'Paul', 'Ghosh', 'Sen', 'Chakraborty'],
    },
  },
];

const EMAIL_PROVIDERS = ['gmail.com', 'yahoo.com', 'outlook.com'];

const DIAGNOSES: Record<Specialization, string[]> = {
  Cardiology: ['Hypertension', 'Arrhythmia', 'Coronary artery disease', 'Heart failure'],
  Neurology: ['Migraine', 'Epilepsy', "Parkinson's disease", 'Multiple sclerosis'],
  Pediatrics: ['Asthma', 'Bronchiolitis', 'Otitis media', 'Chickenpox'],
  Orthopedics: ['Fractured femur', 'ACL tear', 'Osteoarthritis', 'Herniated disc'],
  Dermatology: ['Psoriasis', 'Eczema', 'Melanoma screening', 'Severe acne'],
  Oncology: ['Breast cancer', 'Lung cancer', 'Lymphoma', 'Leukemia'],
  'General Medicine': ['Type 2 diabetes', 'Dengue fever', 'Typhoid fever', 'Pneumonia'],
  Psychiatry: ['Major depression', 'Generalized anxiety', 'Bipolar disorder', 'PTSD'],
  Radiology: ['Suspected fracture', 'Abdominal mass', 'Chest imaging follow-up', 'MRI review'],
  ENT: ['Chronic sinusitis', 'Tonsillitis', 'Hearing loss', 'Vertigo'],
};

const CONDITIONS: { weight: number; value: PatientCondition }[] = [
  { weight: 45, value: 'stable' },
  { weight: 30, value: 'recovering' },
  { weight: 15, value: 'discharged' },
  { weight: 10, value: 'critical' },
];

const GENDER_WEIGHTS: { weight: number; value: Gender }[] = [
  { weight: 48, value: 'female' },
  { weight: 48, value: 'male' },
  { weight: 4, value: 'other' },
];

faker.seed(42);

const now = new Date(new Date().setUTCHours(0, 0, 0, 0));

const slug = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '');

function bangladeshiName(gender: Gender) {
  const group = faker.helpers.weightedArrayElement(NAME_GROUPS);
  const female = gender === 'female' || (gender === 'other' && faker.datatype.boolean());
  const first = faker.helpers.arrayElement(female ? group.female : group.male);
  const lastPool = female && group.femaleLast ? [...group.last, ...group.femaleLast] : group.last;
  return { first, last: faker.helpers.arrayElement(lastPool) };
}

const bangladeshiPhone = () =>
  `+880 1${faker.helpers.arrayElement(['3', '5', '6', '7', '8', '9'])}${faker.string.numeric(2)}-${faker.string.numeric(6)}`;

const uniqueEmail = (taken: Set<string>, first: string, last: string, domain: string) => {
  const base = `${slug(first)}.${slug(last)}`;
  let email = `${base}@${domain}`;
  for (let suffix = 2; taken.has(email); suffix++) email = `${base}${suffix}@${domain}`;
  taken.add(email);
  return email;
};

function buildDoctors() {
  const emails = new Set<string>();
  return Array.from({ length: DOCTOR_COUNT }, (_, index) => {
    const { first, last } = bangladeshiName(faker.helpers.arrayElement(['male', 'female']));
    return {
      name: `Dr. ${first} ${last}`,
      specialization: SPECIALIZATIONS[index % SPECIALIZATIONS.length]!,
      hospital: faker.helpers.arrayElement(HOSPITALS),
      phone: bangladeshiPhone(),
      email: uniqueEmail(emails, first, last, 'doctortracker.dev'),
      createdAt: faker.date.past({ years: 1.5, refDate: now }),
    };
  });
}

const monthWeights = Array.from({ length: TREND_MONTHS }, (_, monthsAgo) => ({
  weight: TREND_MONTHS + 6 - monthsAgo + faker.number.int({ min: 0, max: 3 }),
  value: monthsAgo,
}));

function admissionDate() {
  const monthsAgo = faker.helpers.weightedArrayElement(monthWeights);
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1));
  const to =
    monthsAgo === 0
      ? now
      : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo + 1, 1) - 1);
  return faker.date.between({ from, to });
}

function buildPatient(doctor: { _id: unknown; specialization: Specialization }) {
  const gender = faker.helpers.weightedArrayElement(GENDER_WEIGHTS);
  const { first, last } = bangladeshiName(gender);
  const isChild = doctor.specialization === 'Pediatrics';

  return {
    name: `${first} ${last}`,
    age: isChild ? faker.number.int({ min: 0, max: 17 }) : faker.number.int({ min: 18, max: 92 }),
    gender,
    phone: bangladeshiPhone(),
    ...(faker.datatype.boolean(0.7) && {
      email: `${slug(first)}.${slug(last)}${faker.number.int({ min: 1, max: 99 })}@${faker.helpers.arrayElement(EMAIL_PROVIDERS)}`,
    }),
    condition: faker.helpers.weightedArrayElement(CONDITIONS),
    diagnosis: faker.helpers.arrayElement(DIAGNOSES[doctor.specialization]),
    admittedAt: admissionDate(),
    doctor: doctor._id,
  };
}

async function seed() {
  await Promise.all([User.deleteMany({}), Doctor.deleteMany({}), Patient.deleteMany({})]);
  await syncAllIndexes();

  await User.create({
    name: 'Admin',
    email: env.SEED_ADMIN_EMAIL,
    passwordHash: await hashPassword(env.SEED_ADMIN_PASSWORD),
    role: 'admin',
  });

  const doctors = await Doctor.insertMany(buildDoctors());
  const doctorWeights = doctors.map((doctor) => ({
    weight: faker.number.float({ min: 0.3, max: 3 }),
    value: { _id: doctor._id, specialization: doctor.specialization },
  }));

  const patients = Array.from({ length: PATIENT_COUNT }, () =>
    buildPatient(faker.helpers.weightedArrayElement(doctorWeights)),
  );
  await Patient.insertMany(patients);

  console.log(`Seeded 1 admin, ${doctors.length} doctors, ${patients.length} patients`);
  console.log(`Login: ${env.SEED_ADMIN_EMAIL} / ${env.SEED_ADMIN_PASSWORD}`);
}

if (isProduction && !process.argv.includes('--force')) {
  console.error('Refusing to seed a production database without --force');
  process.exit(1);
}

try {
  await connectDb();
  await seed();
} finally {
  await disconnectDb();
}
