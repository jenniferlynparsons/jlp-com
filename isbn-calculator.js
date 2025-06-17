// ISBN-10 calculator script
// This script calculates ISBN-10 values from ISBN-13 numbers

// Function to calculate ISBN-10 from ISBN-13
function calculateISBN10FromISBN13(isbn13) {
  // Remove any hyphens and ensure we have a clean ISBN-13
  isbn13 = isbn13.replace(/-/g, '').replace(/^['"]/, '').replace(/['"]$/, '');
  
  // Ensure it starts with 978 (book prefixes)
  if (!isbn13.startsWith('978')) {
    return 'Cannot convert: ISBN-13 must start with 978';
  }
  
  // Get the 9 digits we need for the ISBN-10 calculation (remove the 978 prefix and the check digit)
  const digits = isbn13.substring(3, 12);
  
  // Calculate the check digit for ISBN-10
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i)) * (10 - i);
  }
  
  let checkDigit = (11 - (sum % 11)) % 11;
  checkDigit = checkDigit === 10 ? 'X' : checkDigit.toString();
  
  // Return the ISBN-10
  return digits + checkDigit;
}

// Book data
const books = [
  { 
    title: 'A Stirring in the Bones', 
    isbn13: '9781938697388',
    file: 'src/content/books/01-stirring-in-the-bones.md'
  },
  { 
    title: 'Castles & Starships', 
    isbn13: '9781938697425',
    file: 'src/content/books/02-castles-starships.md'
  },
  { 
    title: 'The Man Who Walked', 
    isbn13: '9781938697647',
    file: 'src/content/books/03-man-who-walked.md'
  },
  { 
    title: 'Take On Me', 
    isbn13: '9781949077445',
    file: 'src/content/books/04-take-on-me.md'
  }
];

// Calculate and display results
console.log('ISBN-10 Calculations for Books:');
console.log('=============================');
books.forEach(book => {
  const isbn10 = calculateISBN10FromISBN13(book.isbn13);
  console.log(`Book: ${book.title}`);
  console.log(`ISBN-13: ${book.isbn13}`);
  console.log(`ISBN-10: ${isbn10}`);
  console.log(`File: ${book.file}`);
  console.log('-----------------------------');
});
