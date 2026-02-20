
import re

def fix_sql_syntax(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace backticks `identifier` with [identifier]
    # This regex looks for backticks surrounding text and replaces with brackets
    content = re.sub(r'`([^`]*)`', r'[\1]', content)

    # 2. Replace escaped single quotes (\') with T-SQL double single quotes ('')
    # Note: In Python regex, we need to escape the backslash carefully.
    content = content.replace("\\'", "''")

    # 3. Replace double quotes (") with nothing? Or just standard double quotes?
    # Usually MySQL uses double quotes for string literals too, which T-SQL supports if SET QUOTED_IDENTIFIER is OFF, but standard SQL uses single quotes.
    # If the input has double-quoted strings "value", we might need to convert to 'value'.
    # However, based on the prompt, strings are single-quoted.
    # Let's assume double quotes are rare or used for identifiers (which [ ] handles better).

    # 4. Handle unescaped single quotes within strings?
    # This is tricky. But the prompt showed `CHILDREN\'S`. So likely they ARE escaped with backslash.
    # If there are unescaped ones like `Children's`, that would be a syntax error in MySQL too.
    # So assuming valid MySQL syntax (with backslash escapes), replacing \' with '' should work.

    # 5. Fix common MySQL types to T-SQL types if needed
    # int(11) -> int
    content = re.sub(r'int\(\d+\)', 'int', content, flags=re.IGNORECASE)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Successfully converted {input_file} to {output_file}")

if __name__ == "__main__":
    import os
    
    # Check if input file exists
    input_path = 'backend/dump.sql'
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' not found. Please create it and paste your SQL content there.")
    else:
        fix_sql_syntax(input_path, 'backend/fixed_dump.sql')
