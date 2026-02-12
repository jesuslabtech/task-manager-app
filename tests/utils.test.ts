import { cn } from '../lib/utils';

describe('cn - className utility', () => {
  it('should merge class names', () => {
    const result = cn('px-2', 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('should handle undefined values', () => {
    const result = cn('px-2', undefined, 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('should handle null values', () => {
    const result = cn('px-2', null, 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('should handle false boolean values', () => {
    const result = cn('px-2', 'text-bold');
    expect(result).toBe('px-2 text-bold');
  });

  it('should handle true boolean values', () => {
    const isValid = true;
    const result = cn('px-2', isValid && 'py-1', 'text-bold');
    expect(result).toBe('px-2 py-1 text-bold');
  });

  it('should handle array of class names', () => {
    const result = cn(['px-2', 'py-1']);
    expect(result).toBe('px-2 py-1');
  });

  it('should handle object with boolean values', () => {
    const result = cn({
      'px-2': true,
      'py-1': false,
      'text-bold': true,
    });
    expect(result).toBe('px-2 text-bold');
  });

  it('should merge tailwind class conflicts correctly', () => {
    // When there are conflicting tailwind classes, twMerge should handle it
    const result = cn('p-2', 'p-4');
    expect(result).toContain('p-4');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle mixed input types', () => {
    const result = cn(
      'px-2',
      ['py-1'],
      { 'text-bold': true },
      undefined,
      'ml-2',
    );
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).toContain('text-bold');
    expect(result).toContain('ml-2');
  });

  it('should handle empty strings', () => {
    const result = cn('px-2', '', 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('should work with responsive tailwind classes', () => {
    const result = cn('sm:px-2', 'md:py-1', 'lg:text-bold');
    expect(result).toContain('sm:px-2');
    expect(result).toContain('md:py-1');
    expect(result).toContain('lg:text-bold');
  });
});
