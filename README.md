# hermes-api

Backend for Project Hermes - a queue system for DCISM students, by DCISM students.

## Prerequisites

Ensure the following are installed:

- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
  - [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Docker](https://docs.docker.com/engine/install/)

For WSL 2 users, read this [article](https://code.visualstudio.com/blogs/2020/07/01/containers-wsl).

TL;DR: Windows users may need Docker Desktop, which will automatically detect WSL 2 if installed. You may or may not use the WSL integration, but Docker must be installed regardless of the backend.

## Getting Started

### 1. Clone the Repository

Clone the project to your local machine.

```sh
git clone https://github.com/usc-cisco/hermes-api.git
```

### 2. Open the Project

Open the project in Visual Studio Code:

1. Open the Command Palette (`Ctrl + Shift + P` or `Cmd + Shift + P` on macOS).
2. Run `Dev Containers: Reopen in Container`.

> [!NOTE]
> The initial build may take some time.

### 3. Start the Development Server

Once the environment is ready, start the development server:

```sh
bun dev
```

For setup-related issues, contact Jan Carlo.
