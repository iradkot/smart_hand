const cleanContent = (content: string): string => {
  // Remove comments (multiline and single line)
  content = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

  // Remove import/export statements
  content = content.replace(/import[\s\S]*?;|export[\s\S]*?;/g, '');

  // Remove new lines and tabs
  content = content.replace(/\n|\t/g, '');

  // Remove extra spaces
  content = content.trim();

  return content;
};

export default cleanContent;
