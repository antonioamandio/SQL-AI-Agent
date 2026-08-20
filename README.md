# SQL-AI-Agent 🤖

## About the project

**SQL-AI-Agent** is a simple agent that interacts with **OpenAI through the terminal** to answer questions about access data. The project was developed as part of the **Node.js track at [Rocketseat](https://www.rocketseat.com.br)**, as a way to practice the concepts presented in the lessons.

The application records accesses in a log file using a **non-blocking** approach, avoiding unnecessary operations that could overload memory. This data is later ingested into a database, where it can be queried through questions asked in natural language.

OpenAI is used to **interpret the user's question and generate the corresponding SQL query**, allowing users to query the data without having to write SQL manually.

As an agent, the application also **asks the user for confirmation before executing the suggested SQL query**, allowing them to decide whether or not to proceed with the execution.

For example, given a question such as:

```text
How many accesses did we have last month?
```

The agent can interpret the intent and generate a SQL query similar to:

```sql
SELECT COUNT(*)
FROM accesses
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND created_at < DATE_TRUNC('month', CURRENT_DATE);
```

Before executing the query, the agent asks the user for confirmation. If approved, the query is executed against the database, and the result can then be used by the agent to generate an understandable response in natural language.

### Simplified flow

```text
User
   │
   ▼
Terminal
   │
   ▼
Agent
   │
   ▼
OpenAI
   │
   ▼
SQL
   │
   ▼
User confirmation
   │
   ▼
Database
   │
   ▼
Result
   │
   ▼
OpenAI
   │
   ▼
Natural language response
```

## 🧠 Concepts practiced

During the development of this project, the main concepts practiced were:

* Integrating Node.js applications with AI models;
* Building AI-powered agents;
* Generating SQL queries from natural language;
* Non-blocking file reading and writing;
* Data persistence;
* Data validation with schemas.

## 🛠️ Technologies used

* **Node.js**
* **JavaScript**
* **OpenAI / AI SDK**
* **Zod**
* **Faker**
* **SQL database**

## 📦 Main dependencies

| Dependency        | Purpose                               |
| ----------------- | ------------------------------------- |
| `ai`              | SDK for working with AI models        |
| `@ai-sdk/openai`  | AI SDK integration with OpenAI        |
| `zod`             | Data validation and schema definition |
| `@faker-js/faker` | Generating fake data for testing      |

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/antonioamandio/SQL-AI-Agent.git
```

Navigate to the project directory:

```bash
cd SQL-AI-Agent
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file and add your OpenAI API key:

```env
OPENAI_API_KEY=your_api_key_here
```

Then, run the project:

```bash
npm run start
```

> Available commands may vary depending on the current project configuration.

## 💬 Example questions

The agent can receive natural language questions related to the stored data, such as:

```text
How many accesses did we have last month?
```

```text
Which day had the highest number of accesses?
```

```text
How many accesses did we have this week?
```

Based on these questions, the AI can generate SQL queries to retrieve the corresponding information from the database.

## 🚧 Status

In development.

A project created for **studying and practicing Node.js, SQL, and Artificial Intelligence integration**.
