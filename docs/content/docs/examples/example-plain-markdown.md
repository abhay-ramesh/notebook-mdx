---
title: "Example Usage"
description: "Here's how the same notebook looks with notebook-mdx"
---

# Data Analysis Example

This notebook demonstrates data loading and visualization.

```
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
```

```
# Create sample data
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['New York', 'San Francisco', 'Chicago']
}
df = pd.DataFrame(data)
df
```

```
      name  age           city
0    Alice   25       New York
1      Bob   30  San Francisco
2  Charlie   35        Chicago
```

```
# Calculate average age
average_age = df['age'].mean()
print(f"Average age: {average_age} years")
```

```
Average age: 30.0 years
```

## Results

The average age in our dataset is **30 years**.
