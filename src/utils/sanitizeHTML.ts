import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirtyHTML: string): string => {
    return DOMPurify.sanitize(dirtyHTML);
};