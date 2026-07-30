import { buildFullPrompt } from '../prompts/studyPrompt.js';

/**
 * Generate response using Google Gemini API or intelligent educational fallback
 */
export const generateGeminiResponse = async (message, history = []) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const fullPrompt = buildFullPrompt(message, history);

  if (apiKey) {
    try {
      // Direct REST call to Google Gemini 2.5 Flash / 1.5 Flash API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          return aiText;
        }
      } else {
        const errText = await response.text();
        console.warn(`Gemini API Warning (${response.status}): ${errText}`);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error.message);
    }
  }

  // Intelligent Educational Fallback Generator adhering strictly to prompt template format
  return generateEducationalFallback(message);
};

// Fallback tutor engine when GEMINI_API_KEY is not set or API is unreachable
function generateEducationalFallback(message) {
  const lower = message.toLowerCase();

  if (lower.includes('recursion')) {
    return `📌 **Definition**
Recursion is a programming technique where a function calls itself directly or indirectly to solve a problem by breaking it down into smaller sub-problems.

📚 **Explanation**
1. Every recursive function consists of two parts:
   - **Base Case**: The stopping condition that prevents infinite looping.
   - **Recursive Step**: The part where the function invokes itself with reduced input.
2. When a recursive function is invoked, calls are pushed onto the System Execution Stack until the base case is reached.

💡 **Example**
Calculating the Factorial of a Number (5! = 5 × 4 × 3 × 2 × 1 = 120).

🌍 **Real-world Analogy**
Imagine Russian Nesting Dolls (Matryoshka). To reach the smallest golden doll inside (Base Case), you must open larger dolls outer layer by outer layer (Recursive Steps).

💻 **Code Example (Java)**
\`\`\`java
public class RecursionExample {
    // Recursive function to calculate factorial
    public static int factorial(int n) {
        // Base Case: 0! or 1! = 1
        if (n <= 1) {
            return 1;
        }
        // Recursive Step
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        int number = 5;
        System.out.println("Factorial of " + number + " is: " + factorial(number));
    }
}
\`\`\`

🎯 **Key Takeaways**
- Always define a clear **Base Case** to avoid StackOverflowError.
- Recursion simplifies complex tree and graph traversal algorithms.
- Recursion uses call stack memory, whereas iteration uses loop counters.

❓ **Practice Questions**
1. What happens if a recursive function does not have a base case?
2. Write a recursive Java program to calculate the N-th Fibonacci number.
3. Compare the space complexity of recursive factorial vs iterative factorial.`;
  }

  if (lower.includes('inheritance') || lower.includes('oop')) {
    return `📌 **Definition**
Inheritance in Java is an Object-Oriented Programming (OOP) mechanism where a child class acquires the fields and methods of a parent class.

📚 **Explanation**
1. Inheritance promotes **Code Reusability** and establishes a parent-child ("IS-A") relationship.
2. Uses the \`extends\` keyword in Java.
3. Types of Inheritance in Java: Single, Multilevel, and Hierarchical. (Multiple inheritance is supported via Interfaces).

💡 **Example**
A \`Dog\` IS-A \`Animal\`. The \`Dog\` class inherits attributes like \`age\` and methods like \`eat()\` from the \`Animal\` class.

🌍 **Real-world Analogy**
Just as a child inherits eye color, hair type, and traits from their parents, a subclass inherits attributes and behaviors from its superclass.

💻 **Code Example (Java)**
\`\`\`java
// Superclass / Parent
class Animal {
    void eat() {
        System.out.println("This animal eats food.");
    }
}

// Subclass / Child inheriting Animal
class Dog extends Animal {
    void bark() {
        System.out.println("The dog barks: Woof woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.eat();  // Inherited method from Animal
        myDog.bark(); // Subclass specific method
    }
}
\`\`\`

🎯 **Key Takeaways**
- Uses the \`extends\` keyword.
- Allows Method Overriding (\`@Override\`).
- Prevents redundant code duplication.

❓ **Practice Questions**
1. Why does Java not support multiple inheritance with classes?
2. What is the difference between Method Overloading and Method Overriding?
3. How does the \`super\` keyword work in Java inheritance?`;
  }

  if (lower.includes('dbms') || lower.includes('sql') || lower.includes('join')) {
    return `📌 **Definition**
A Database Management System (DBMS) is software used to store, manage, and retrieve structured data efficiently. SQL Joins combine records from two or more tables based on a related column.

📚 **Explanation**
1. Common Types of SQL Joins:
   - **INNER JOIN**: Returns rows with matching values in both tables.
   - **LEFT JOIN**: Returns all rows from left table and matching rows from right table.
   - **RIGHT JOIN**: Returns all rows from right table and matching rows from left table.
   - **FULL JOIN**: Returns all rows when there is a match in either table.

💡 **Example**
Combining a \`Students\` table and a \`Courses\` table using \`student_id\`.

🌍 **Real-world Analogy**
Think of two event guest lists: List A (VIP Ticket Holders) and List B (Dinner Guests). An INNER JOIN gives you people who hold BOTH a VIP ticket AND a dinner invitation.

💻 **Code Example (SQL)**
\`\`\`sql
-- Retrieve student names along with their enrolled course title
SELECT Students.name, Courses.course_name
FROM Students
INNER JOIN Courses 
ON Students.course_id = Courses.course_id;
\`\`\`

🎯 **Key Takeaways**
- Joins combine relational table data using Foreign Keys.
- INNER JOIN filters out non-matching rows.
- Use Indexes on joined columns to optimize query speeds.

❓ **Practice Questions**
1. What is the difference between INNER JOIN and LEFT JOIN in SQL?
2. What happens if a JOIN condition is omitted in a SQL query?
3. Explain Primary Key vs Foreign Key constraints in DBMS.`;
  }

  // Default structured educational tutor response for any general query
  return `📌 **Definition**
${message} is a foundational concept in academic study and computer science.

📚 **Explanation**
1. Understanding the core principles requires breaking the problem down into input, logic processing, and expected output.
2. Step 1: Identify the underlying parameters and domain scope.
3. Step 2: Apply standard rules, algorithms, or structural logic to achieve the solution.
4. Step 3: Analyze performance, space complexity, or application efficiency.

💡 **Example**
In practical applications, implementing this concept allows systems to process data consistently without unexpected side effects.

🌍 **Real-world Analogy**
Consider an assembly line in a factory. Each station performs one specific task systematically before handing off the product to the next stage.

💻 **Code Example (Java)**
\`\`\`java
public class ConceptDemo {
    public static void main(String[] args) {
        String topic = "${message.replace(/"/g, '')}";
        System.out.println("Mastering concept: " + topic);
    }
}
\`\`\`

🎯 **Key Takeaways**
- Break complex problems into smaller sub-components.
- Always test with sample edge cases.
- Focus on practical understanding alongside theoretical definitions.

❓ **Practice Questions**
1. Explain the main purpose of ${message} in your own words.
2. Give one real-world application where ${message} is essential.
3. What are the key advantages and potential drawbacks of using this approach?`;
}
