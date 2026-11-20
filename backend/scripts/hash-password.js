// Usage: npm run hash-password -- "your-strong-password"
import { hashPassword } from '../src/utils/auth.js';

const pwd = process.argv[2];
if (!pwd || pwd.length < 12) {
  console.error('Provide a password of at least 12 characters: npm run hash-password -- "your-strong-password"');
  process.exit(1);
}
console.log(hashPassword(pwd));
