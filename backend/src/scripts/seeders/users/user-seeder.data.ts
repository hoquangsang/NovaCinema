import { User } from 'src/modules/users/schemas/user.schema';
import { hashSync } from 'bcrypt';

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickOne = <T>(arr: T[]) => arr[randomInt(0, arr.length - 1)];

const randomDateOfBirth = () => {
  const year = randomInt(1985, 2005);
  const month = randomInt(0, 11);
  const day = randomInt(1, 28);
  return new Date(year, month, day);
};

const randomPhone = () => '0' + randomInt(300000000, 999999999).toString();

const randomEmailVerified = () => Math.random() < 0.9;

const FULL_NAMES = [
  'Nguyễn Văn An',
  'Trần Thị Mai',
  'Lê Hoàng Minh',
  'Phạm Thu Trang',
  'Võ Thành Long',
  'Bùi Đức Anh',
  'Đặng Thị Hương',
  'Phan Quốc Huy',
  'Huỳnh Ngọc Lan',
  'Đỗ Minh Quân',
  'Cao Thị Ngọc',
  'Dương Anh Tuấn',
  'Lý Thảo Nhi',
  'Hoàng Quốc Bảo',
  'Nguyễn Thanh Tùng',
  'Trịnh Minh Châu',
  'Vũ Hải Đăng',
  'Phạm Mỹ Linh',
  'Lâm Nhật Nam',
  'Ngô Thị Bích',
  'Trần Văn Khoa',
  'Nguyễn Thị Lan',
  'Phạm Văn Sơn',
  'Lê Thị Hồng',
  'Đinh Quang Vinh',
  'Bùi Thị Thanh',
  'Ngô Minh Tuấn',
  'Vũ Thị Ngọc',
  'Trần Nhật Nam',
  'Phan Thị Bích',
];

const EMAIL_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'];

const normalize = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, '');

const PASSWORD_HASH = hashSync('123456', 10);

export const USERS_DATA: Partial<User>[] = FULL_NAMES.map((fullName, index) => {
  const baseUsername = normalize(fullName);
  const suffix = randomInt(1, 99);

  const username = `${baseUsername}${suffix}`;
  const email = `${username}@${pickOne(EMAIL_DOMAINS)}`;

  return {
    email,
    emailVerified: randomEmailVerified(),
    password: PASSWORD_HASH,
    username,
    fullName,
    phoneNumber: randomPhone(),
    dateOfBirth: randomDateOfBirth(),
    active: true,
  };
});
