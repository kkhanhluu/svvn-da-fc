export function removeHTMLTags(input: string): string {
  return input.replace(/<[^>]*>|&[^;]+;/g, '');
}
