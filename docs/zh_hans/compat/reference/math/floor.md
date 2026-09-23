# floor (Lodash 兼容性)

::: warning 请使用 `Math.floor`

这个 `floor` 函数由于小数位计算和内部函数调用会运行较慢。

请使用更快、更现代的 `Math.floor`。

:::

将数字向下舍入到指定的小数位数。

```typescript
const result = floor(number, precision);
```

## 用法

### `floor(number, precision?)`

当您想要将数字向下舍入到特定小数位数时，请使用 `floor`。

```typescript
import { floor } from 'es-toolkit/compat';

// 基本向下舍入（到整数）
floor(4.9);
// Returns: 4

floor(4.1);
// Returns: 4

// 向下舍入到小数点后两位
floor(6.994, 2);
// Returns: 6.99

floor(6.999, 2);
// Returns: 6.99

// 向下舍入到负数位（十位数）
floor(6040, -2);
// Returns: 6000

floor(1234, -2);
// Returns: 1200

// 负数也向下舍入
floor(-4.1);
// Returns: -5

floor(-6.994, 2);
// Returns: -7.00
```

#### 参数

- `number` (`number`): 要向下舍入的数字。
- `precision` (`number`, 可选): 要向下舍入的小数位数。默认值为 `0`。

两个参数都按 Lodash 的方式进行转换：`number` 转换为数字，`precision` 转换为整数。因此 `floor('4.016', '2')` 也可以工作，符号会变成 `NaN`，`true` 被视为小数位数 `1`，超过 `292` 的 `precision` 会被限制为 `292`。

#### 返回值

(`number`): 返回向下舍入到指定小数位数的数字。
