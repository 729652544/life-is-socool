var Environment = 'master';
export function getEnvironment() {
  return Environment === 'test' ? 'test' : 'master';
}