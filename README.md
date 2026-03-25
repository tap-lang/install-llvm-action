# install-llvm-action

A GitHub Action to install LLVM and Clang with specified version.

All code written by AI.

## Usage

### Basic Usage

```yaml
steps:
  - name: Install LLVM
    uses: tap-lang/install-llvm-action@v1
    with:
      version: '18.1.8'
```

### Advanced Usage

```yaml
steps:
  - name: Install LLVM with specific components
    uses: tap-lang/install-llvm-action@v1
    with:
      version: '18.1.8'
      arch: 'x86_64'
      os: 'linux'
      components: 'clang,lld,compiler-rt'
```

## Inputs

| Input | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| `version` | LLVM version to install (e.g., 18, 17.0.6) | Yes | N/A |
| `arch` | Architecture (e.g., x86_64, arm64) | No | x86_64 |
| `os` | Operating system (e.g., linux, macos, windows) | No | ${{ runner.os }} |
| `components` | Additional LLVM components to install (e.g., clang, lld, compiler-rt) | No | clang |

## Outputs

| Output | Description |
| ------ | ----------- |
| `llvm-home` | Path to the installed LLVM directory |
| `clang-version` | Version of the installed Clang |
| `llvm-version` | Version of the installed LLVM |

## Supported Platforms

- Linux (x86_64, arm64)
- macOS (x86_64, arm64)
- Windows (x86_64)

## License

MIT

