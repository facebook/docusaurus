# task_manager.py

class Task:
    def __init__(self, title, description, status='To Do'):
        self.title = title
        self.description = description
        self.status = status

class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, task):
        self.tasks.append(task)

    def list_tasks(self):
        for index, task in enumerate(self.tasks, start=1):
            print(f"{index}. {task.title} ({task.status})")

    def update_status(self, task_index, new_status):
        if 1 <= task_index <= len(self.tasks):
            self.tasks[task_index - 1].status = new_status
            print(f"Task {task_index} status updated to {new_status}")
        else:
            print("Invalid task index.")

def main():
    task_manager = TaskManager()

    while True:
        print("\nTask Manager Menu:")
        print("1. Add Task")
        print("2. List Tasks")
        print("3. Update Task Status")
        print("4. Quit")

        choice = input("Enter your choice: ")

        if choice == '1':
            title = input("Enter task title: ")
            description = input("Enter task description: ")
            task = Task(title, description)
            task_manager.add_task(task)
            print("Task added.")

        elif choice == '2':
            print("\nTasks:")
            task_manager.list_tasks()

        elif choice == '3':
            task_manager.list_tasks()
            task_index = int(input("Enter the task index to update: "))
            new_status = input("Enter the new status: ")
            task_manager.update_status(task_index, new_status)

        elif choice == '4':
            print("Goodbye!")
            break

        else:
            print("Invalid choice. Please select a valid option.")

if __name__ == "__main__":
    main()
