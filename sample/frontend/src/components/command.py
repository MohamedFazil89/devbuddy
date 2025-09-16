def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

def maximum(a, b, c):
    return max(a, b, c)

def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True


# === Menu driver code ===
if __name__ == "__main__":
    while True:
        print("\n=== Python Toolbox ===")
        print("1. Greet someone")
        print("2. Add two numbers")
        print("3. Find maximum of three numbers")
        print("4. Factorial of a number")
        print("5. Check if a number is prime")
        print("0. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            name = input("Enter name: ")
            print(greet(name))

        elif choice == "2":
            a = int(input("Enter first number: "))
            b = int(input("Enter second number: "))
            print("Sum:", add(a, b))

        elif choice == "3":
            a = int(input("Enter first number: "))
            b = int(input("Enter second number: "))
            c = int(input("Enter third number: "))
            print("Maximum:", maximum(a, b, c))

        elif choice == "4":
            n = int(input("Enter a number: "))
            print(f"Factorial of {n} is:", factorial(n))

        elif choice == "5":
            n = int(input("Enter a number: "))
            print(n, "is prime?", is_prime(n))

        elif choice == "0":
            print("Goodbye!")
            break

        else:
            print("Invalid choice, try again.")
