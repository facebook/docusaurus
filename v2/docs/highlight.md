---
id: highlight
title: Syntax highlighting demo
---

```cpp
#include<bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello world\n";
    return 0;
}

```

```cpp
#include <iostream>
using namespace std;

int main()
{
  int n, i;
  bool isPrime = true;

  cout << "Enter a positive integer: ";
  cin >> n;

  for(i = 2; i <= n / 2; ++i)
  {
      if(n % i == 0)
      {
          isPrime = false;
          break;
      }
  }
  if (isPrime)
      cout << "This is a prime number";
  else
      cout << "This is not a prime number";

  return 0;
}
```