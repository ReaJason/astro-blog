---
title: Forever Algorithm
tags: [Algotrithm]
categories: [Java]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/ForeverAlgorithm_index_img.jpg
date: "2021-08-21 09:35:00"
description: "使用 Java 编程语言编写数据结构与算法"
sticky: 99
---
## 语言基础

### 1、数组

- 数组的长度是确定的，数组一旦创建，大小就不可改变
- 元素必须同类型
- 数组是引用类型
- 数组的合法索引界限为 [0,arr.length-1]

```java
// 初始化方法1
int[] a = {1,2,3,4,5,6};

// 初始化方法2
int[] b = new int[10];

// 常用操作
int[] a = {1, 2, 3, 4, 5, 6, 7, 8, 9};
int[] b = new int[10];
System.out.println(a.length);

// 遍历数组1
for (int i = 0; i < a.length; i++) {
    System.out.println(a[i]);
}
// 遍历数组2
for (int i : a) {
    System.out.println(i);
}
```

### 2、字符串

- 字符串是不可变类型
- Java 存在字符串常量池，如若常量池出现则复用
- Java 存在常量优化机制，"a"+"b"+"c" 在编译阶段直接变成 "abc"
- 字符串相加时，JVM 会创建一个 StringBuilder 对象，调用 append() 方法，最后调用 ToString() 返回字符串
- == 比较地址是否相同，s1.equals(s2) 比较字符串内容是否相同

```java
String s1 = "abc";
String s2 = "a" + "b" + "c";
String s = "ab";
String s3 = s + "c";
char[] chars = {'a', 'b', 'c'};
String s4 = new String(chars);
byte[] bytes = {97, 98, 99};
String s5 = new String(bytes);
System.out.println(s1); // abc
System.out.println(s2); // abc
System.out.println(s3); // abc
System.out.println(s4); // abc
System.out.println(s5); // abc
System.out.println(s1 == s2); // true
System.out.println(s1 == s3); // false
System.out.println(s1.equals(s3)); // true
```

```java
// 常用操作
String s1 = "hello world";
System.out.println(s1.length()); // 11
System.out.println(s1.charAt(3)); // l
System.out.println(s1.substring(3, 5)); // lo 
System.out.println(s1.substring(6)); // world
System.out.println(s1.replace("o","f")); // hellf wfrld
System.out.println(Arrays.toString(s1.split(" "))); // [hello, world]
System.out.println(s1.toCharArray()); // hello world
```

```
// StringBuilder 是线程非安全的、StringBuffer 是线程安全的
```



### 3、常用容器

#### 3.1 ArrayList

#### 3.2 LinkedLisk

#### 3.3 HashSet

#### 3.4 TreeSet

#### 3.5 HashMap

#### 3.6 TreeMap



# 排序算法

## 1、冒泡排序

### 1.1 排序思想

数组从前往后依次两两比较，逆序则交换，因此每一轮比较可以确定一个最大值放置在后面，就像水底下的气泡一样逐渐上冒。若数组一共有 n 个元素，因为每一轮能够确定一个最大值，因此需要 n-1 轮数组即可排序完成（最后只剩下一个元素不需要排序了）。优化：若一轮比较中没有需要交换的元素即可认为是排序完毕。

- 时间复杂度：O(n²)
- 空间复杂度：O(1)
- 稳定性：不稳定
  



### 1.2 排序演示

```java
public class Code02_BubbleSort {
    
    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
    
    public static void main(String[] args) {
        int[] arr = {3, 9, -1, 10, -2};
        // 第一轮冒泡，两两比较将最大值放置在最后，即数组中的 10 放在最后
        for (int i = 0; i < arr.length - 1 - 0; i++) {
            if(arr[i]>arr[i+1]){
                swap(arr, i, i+1);
            }
        }
        System.out.println(Arrays.toString(arr));  // [3, -1, 9, -2, 10]

        // 第二轮冒泡，两两比较，将第二大的值放在倒数第二的位置，即数组中的 9 放在倒数第二位置
        for (int i = 0; i < arr.length - 1 - 1; i++) {
            if(arr[i]>arr[i+1]){
                swap(arr, i, i+1);
            }
        }
        System.out.println(Arrays.toString(arr));  // [-1, 3, -2, 9, 10]

        // 第三轮冒泡，两两比较，将第三大的值放在倒数第三的位置，即数组中的 3 放在倒数第三位置
        for (int i = 0; i < arr.length - 1 - 2; i++) {
            if(arr[i]>arr[i+1]){
                swap(arr, i, i+1);
            }
        }
        System.out.println(Arrays.toString(arr));  // [-1, -2, 3, 9, 10]

        // 第四轮冒泡，两两比较，将第四大的值放在倒数第四的位置，即数组中的 -1 放在倒数第四位置
        for (int i = 0; i < arr.length - 1 - 3; i++) {
            if(arr[i]>arr[i+1]){
                swap(arr, i, i+1);
            }
        }
        System.out.println(Arrays.toString(arr));  // [-2, -1, 3, 9, 10]

        // 最后留下一个 -2 它不需要比较了，因此 5 个元素需要 4 轮冒泡
    }
}
```

### 1.3 排序代码

```java
public class Code02_BubbleSort {
    public static void bubbleSort(int[] arr) {
        // 排除不需要排序的情况
        if (arr == null || arr.length < 2) {
            return;
        }
        // 若数组元素个数有 arr.length 个，则需要冒泡的轮数为 arr.length -1 轮
        // 第一层 for 循环，0 开始，到 arr.length - 2，总轮数则是 arr.length - 1
        for (int i = 0; i < arr.length - 1; i++) {

            // 由上面一小节可知，写出如下代码
            // 第一轮 ，i = 0，因此比较到 arr.length - 2 的位置
            // 最后比较 arr.length -2 和 arr.length - 1 的位置，将最大值放在 arr.length - 1 的位置，即最后一个位置
            // 第二轮，i = 1，因此比较到 arr.length - 2 - 1 的位置
            // 最后比较 arr.length -1 和 arr.length - 2 的位置，将第二大的值放在 arr.length - 2 的位置，即倒数第二位置
            // ...
            // 最后一轮，i = arr.length - 2，因此比较到 arr.length - 2 - (arr.length - 2) = 0
            // 即只需要比较索引 0 位置 和 1 位置的两个值，将倒数第二大的值放在 1 位置，最小的自然而然就是 0 位置上的值了，结束排序
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr, j, j + 1);
                }
            }
        }
    }

    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    public static void main(String[] args) {
        int[] arr = {3, 9, -1, 10, -2};
        bubbleSort(arr);
        System.out.println(Arrays.toString(arr)); // [-2, -1, 3, 9, 10]
    }
}
```

### 1.4 优化

```java
public static void bubbleSort(int[] arr) {
    // 排除不需要排序的情况
    if (arr == null || arr.length < 2) {
        return;
    }
    boolean flag = false;
    for (int i = 0; i < arr.length - 1; i++) {
        for (int j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                flag = true; // 如果出现需要交换的位置，则将 flag 设为 true
                swap(arr, j, j + 1);
            }
        }
        // 若比较完一轮，flag 仍然为 false，则认为数组已有序（未出现需要交换的位置），退出排序循环
        if (!flag){
            break;
        }else{
            flag = false; // 重置 flag 用于下一轮判断
        }
    }
}
```

## 2、选择排序

### 2.1 排序思想

每一轮比较，获取最小值索引下标，放到前面，比较完后再交换，减少了交换。第一次比较整个数组，拿到最小值的下标 minIndex，然后交换 0 和 minIndex 索引位置的值；第二次比较 arr[1]~arr[n-1] 上的值（0 位置在第一次比较已经放上了数组最小值了），获取第二小的下表 minIndex，然后交换 1 和 minIndex 索引位置的值......最后整个数组就有序了。

- 时间复杂度：O(n²)
- 空间复杂度：O(1)
- 稳定性：稳定

### 2.2 排序演示

```java
public class Code01_SelectionSort {

    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 7, 1};

        // 第一轮排序，假设 0 位置为最小索引（第一轮确定索引 0 位置的值），获取整个数组最小索引下标位置，即 minIndex = 3，交换 0 和 3 位置的值
        int minIndex = 0;
        // 从 1 位置开始比较，自己没必要和自己比了
        for(int i = 0 + 1; i < arr.length; i++){
            if(arr[i]< arr[minIndex]){
                minIndex = i;
            }
        }
        swap(arr, 0, minIndex);
        System.out.println(Arrays.toString(arr)); // [1, 5, 7, 2]

        // 第二轮，假设 1 位置为最小索引（第二轮确定索引 1 位置的值），获取 1 ~ arr.length 上最小索引下标位置，即 minIndex = 3，交换 1 和 3 位置的值
        minIndex = 1;
        // 从 2 位置开始比较，自己没必要和自己比了
        for(int i = 1 + 1; i < arr.length; i++){
            if(arr[i]< arr[minIndex]){
                minIndex = i;
            }
        }
        swap(arr, 1, minIndex);
        System.out.println(Arrays.toString(arr)); // [1, 2, 7, 5]

        // 第三轮，假设 2 位置为最小索引（第三轮确定索引 2 位置的值），获取 2 ~ arr.length 上最小索引下标位置，即 minIndex = 3，交换 2 和 3 位置的值
        minIndex = 2;
        // 从 3 位置开始比较，自己没必要和自己比了
        for(int i = 2 + 1; i < arr.length; i++){
            if(arr[i]< arr[minIndex]){
                minIndex = i;
            }
        }
        swap(arr, 2, minIndex);
        System.out.println(Arrays.toString(arr)); // [1, 2, 5, 7]

        // 最后一个位置只有一个元素不再需要比较，因此 n 个元素只需要比较 n-1 轮
    }
}
```

### 2.3 排序代码

```java
public class Code01_SelectionSort {
    public static void selectionSort(int[] arr) {
        // 排除不需要排序的情况
        if (arr == null || arr.length < 2) {
            return;
        }

        // 比较 arr.length - 1 轮，i 从 0 ~ arr.length - 2 即 arr.length - 1 轮
        // i = 0 即确定 索引 0 位置上的值，i = arr.length - 2 即确定 arr.length - 2 位置上的值，最后 arr.length - 1 位置不需要再比较
        for (int i = 0; i < arr.length - 1; i++) {
            int minIndex = i;
            // 自己不需要和自己比较，找到 i + 1 ~ arr.length -1 上的最小值下标
            for (int j = i + 1; j < arr.length; j++) {

                // 依次比较，更新 minIndex 的值
                if(arr[j] < arr[minIndex]){
                    minIndex = j;
                }
            }
            // 交换当前待确定位置的值和最小下标位置的值
            // 小优化：如果最小值索引位置即为待确定位置的值，则不需要交换
            if(i != minIndex){
                swap(arr, i, minIndex);
            }
        }
    }

    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
    
    public static void main(String[] args) {
        int[] arr = {2, 5, 1, 7, 2, 9, 10, 35};
        selectionSort(arr);
        System.out.println(Arrays.toString(arr)); // [1, 2, 2, 5, 7, 9, 10, 35]
    }
}
```

## 3、插入排序

### 3.1 排序思想

将整个数组分为有序区和无序区，每一轮将无序区第一个元素往前依次比较，插入到有序区中。默认假定第一个数已有序，即需要确认 1 ~ n 位置上的元素位置，需要 n -1 轮。

- 时间复杂度：O(n²)
- 空间复杂度：O(1)
- 稳定性：不稳定



### 3.2 排序演示

```java
public class Code03_InsertionSort {

    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 1, 3};

        // 默认 0 位置已有序
        // 第一轮，将索引 1 位置的值（待插入位置的值）依次比较插入到有序区
        // i >= 0，确保索引不越界，比较到 0 位置结束
        // 索引 1-1 位置的值 2 比 待插入值 5 小，因此直接跳出循环，i = 0
        int num = arr[1];
        int i;
        for (i = 1 - 1; i >= 0 && arr[i] > num; i--) {
            arr[i + 1] = arr[i];
        }
        // i + 1 = 1，因此自己等于自己，不变
        arr[i + 1] = num;
        System.out.println(Arrays.toString(arr)); // [2, 5, 1, 3]

        // 第二轮，将索引 2 位置的值依次比较插入到有序区
        // num 记录当前待插入的值
        num = arr[2];

        // 第一步：索引 2-1 位置的值 5 与 待插入值 1 进行比较，5 > 1，因此将 5 往后移即 arr[2] = arr[1]，数组变为 [2, 5, 5, 3]
        // 第二步：继续往前比较，索引 0 位置上的值 2 比待插入值 1 大，因此将 2 往后移，即 arr[1] = arr[0]，数组变为 [2, 2, 5, 3]
        // i--，不满足 i>=0，停止比较，第二轮结束，此时 i = -1
        for (i = 2 - 1; i >= 0 && arr[i] > num; i--) {
            arr[i + 1] = arr[i];
        }
        // 因此将待插入值插入到 0 索引位置上
        arr[i + 1] = num;
        System.out.println(Arrays.toString(arr)); // [1, 2, 5, 3]

        // 第三轮，将索引 3 位置的值依次比较插入到有序区
        num = arr[3];

        // 第一步：索引 3-1 位置的值 5 与 待插入值 3 进行比较，5 > 3，因此将 5 往后移即 arr[3] = arr[2]，数组变为 [1, 2, 5, 5]
        // 第二步：继续往前比较，索引 1 位置上的值 2 比待插入值 3 小，因此结束循环，此时 i = 1
        for (i = 3 - 1; i >= 0 && arr[i] > num; i--) {
            arr[i + 1] = arr[i];
        }
        // 因此将待插入值插入到 2 索引位置上
        arr[i + 1] = num;
        System.out.println(Arrays.toString(arr));  // [1, 2, 3, 5]
    }
}
```

### 3.3 排序代码

```java
public class Code03_InsertionSort {
    public static void insertionSort(int[] arr) {
        // 排除不需要排序的情况
        if (arr == null || arr.length < 2) {
            return;
        }
        // 0 ~ i 位置上已有序，0 位置已认为有序，从 1 位置开始排序，依次确定待排序
        for (int i = 1; i < arr.length; i++) {

            // 记录下当前待插入的值
            int num = arr[i];
            int j;
            // 从 i-1 开始比较，当 j 不越界 并且 j 位置的值比待插入值大，则后移
            for (j = i - 1; j >= 0 && arr[j] > num; j--) {
                arr[j + 1] = arr[j];
            }
            // 确定了待插入所在位置为 j + 1，因为退出循环的时候 j 位置不满足 j>= 0 越界，或者 j 位置已经小于 num 位置了
            arr[j + 1] = num;
        }
    }

    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
    
    public static void main(String[] args) {
        int[] arr = {2, 5, 1, 3, 5, 1, 8, 10};
        insertionSort(arr);
        System.out.println(Arrays.toString(arr)); // [1, 1, 2, 3, 5, 5, 8, 10]
    }
}
```

## 4、希尔排序

### 4.1 排序思想

将数组按一定的增量进行分组，对每组进行插入排序算法排序，随着增量减少到 1，停止排序，数组有序。希尔排序是插入排序的优化版本，希尔排序通过递减增量排序使得整个数组相对有序，减少了比较次数（插入排序中，如果最小的数在最后需要从后往前一直比较）。

### 4.2 排序演示

```java
public class Code04_ShellSort {

    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    public static void main(String[] args) {
        int[] arr = {8, 9, 1, 7, 2, 3, 5, 4, 6, 0};

        // 第一次排序，设置增量为 arr.length / 2 = 5，将整个数组分成 5 组进行插入排序
        // [8,3],[9,5],[1,4],[7,6],[2,0]
        for (int i = 5; i < arr.length; i++) {
            int num = arr[i];
            int j;
            for (j = i - 5; j >= 0 && arr[j] > num; j -= 5) {
                arr[j + 5] = arr[j];
            }
            arr[j + 5] = num;
        }
        System.out.println(Arrays.toString(arr)); // [3, 5, 1, 6, 0, 8, 9, 4, 7, 2]

        // 第二次排序，设置增量为 5 / 2 = 2，将整个数组分成 2 组进行插入排序
        // [3,1,0,9,7],[5,6,8,4,2]
        for (int i = 2; i < arr.length; i++) {
            int num = arr[i];
            int j;
            for (j = i - 2; j >= 0 && arr[j] > num; j -= 2) {
                arr[j + 2] = arr[j];
            }
            arr[j + 2] = num;
        }
        System.out.println(Arrays.toString(arr)); // [0, 2, 1, 4, 3, 5, 7, 6, 9, 8]

        // 第三次次排序，设置增量为 2 / 2 = 1，将整个数组分成 1 组进行插入排序，当增量为 1 是，则是最后一轮，因为是对整个数组进行插入排序了
        // [3,1,0,9,7],[5,6,8,4,2]
        for (int i = 1; i < arr.length; i++) {
            int num = arr[i];
            int j;
            for (j = i - 1; j >= 0 && arr[j] > num; j -= 1) {
                arr[j + 1] = arr[j];
            }
            arr[j + 1] = num;
        }
        System.out.println(Arrays.toString(arr)); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
}
```

### 4.3 排序代码

```java
public class Code04_ShellSort {

    public static void shellSort(int[] arr) {
        if (arr == null || arr.length < 2) {
            return;
        }
        // 设置初始增量为 arr.length / 2，当增量为 1 即为最后一轮排序，每排序完一轮 增量除 2
        for (int step = arr.length / 2; step >= 1; step /= 2) {

            // 通过增量将数组分组进行插入排序
            for (int i = step; i < arr.length; i++) {
                int num = arr[i];
                int j;
                for (j = i - step; j >= 0 && arr[j] > num; j -= step) {
                    arr[j + step] = arr[j];
                }
                arr[j + step] = num;
            }
        }

    }

    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 1, 3, 5, 1, 8, 10};
        shellSort(arr);
        System.out.println(Arrays.toString(arr)); // [1, 1, 2, 3, 5, 5, 8, 10]
    }
}
```

## 5、快速排序

### 5.1 排序思想

每次排序选取一个基准元素，将比基准元素小的放在左部分，比基准元素大的放在右部分，这样即可找到基准元素所在位置，递归依次在左部分选取基准元素确定位置，和右部分选取基准元素确定位置，最终有序。

### 5.2 排序演示

```java
/*
数组 int[] arr = {2, 5, 1, 3, 0};
1、选取基准元素，pivot = arr[0] = 2，left = 0，right = 4
*/
```

### 5.3 排序代码

```java
public class Code05_QuickSort {

    public static void quickSort(int[] nums, int left, int right) {
        if (left < right) {
            int pIndex = partition(nums, left, right);
            quickSort(nums, left, pIndex - 1);
            quickSort(nums, pIndex + 1, right);
        }
    }

    public static int partition(int[] nums, int left, int right) {
        // 将左侧第一个元素作为基准值
        int pivot = nums[left];

        int i = left;
        int j = right;

        while (i < j) {
            // 在右侧找大于基准元素的索引下标(如果当前值大于等于基准值就往左移直到找到小于基准值的索引位置)
            while (i < j && nums[j] >= pivot) {
                j--;
            }
            // 在左侧找大于基准元素的索引下标(如果当前值小于等于基准值就往右移直到找到大于基准值的索引位置)
            while (i < j && nums[i] <= pivot) {
                i++;
            }
            // 由于最后一次交换后不会 break，仍然会跑一遍上面的代码，此时 i 来到了右侧指向大于等于基准值
            if (i < j) {
                // 将左侧大的值和右侧小的值进行交换
                // 最后一次交换后，即[left, i] <= pivot ，[j,right] >= pivot
                swap(nums, i, j);
            }

        }
        swap(nums, left, j);
        return j;
    }

    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    public static void main(String[] args) {
        int[] arr = {0, 1, 2, 1, 5, 0, 3,2,1};
        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}
```

## 6、归并排序

### 6.1 排序思想

归并使用分而治之的思想，将整个数组分成一个一个元素然后进行排序合并，左边排好序，右边排好序，最后整体排序。

### 6.2 排序演示

```java

```

### 6.3 排序代码

```java
public class Code06_MergeSort {

    public static void mergeSort(int[] arr, int left, int right) {
        // 一个元素默认有序
        if (left == right) {
            return;
        }
        int mid = left + (right - left) / 2;
        // 将左边排好序
        mergeSort(arr, left, mid);
        // 将右边排好序
        mergeSort(arr, mid + 1, right);
        // 将排好序的两部分并在一起
        merge(arr, left, mid, right);
    }

    public static void merge(int[] arr, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = 0;
        int p1 = left;
        int p2 = mid + 1;
        // 双指针依次比较大小放入 temp 数组中
        while (p1 <= mid && p2 <= right) {
            temp[i++] = arr[p1] <= arr[p2] ? arr[p1++] : arr[p2++];
        }
        // 当双指针一边越界，另一边仍有元素，依次放入 temp 数组中
        while (p1 <= mid) {
            temp[i++] = arr[p1++];
        }

        while (p2 <= right) {
            temp[i++] = arr[p2++];
        }

        // 将 temp 数组中的值放入原数组
        for (int i1 = 0; i1 < temp.length; i1++) {
            arr[left + i1] = temp[i1];
        }
    }

    public static void main(String[] args) {
        int[] arr = {8, 9, 1, 7, 2, 3, 5, 4, 6, 0};
        mergeSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr)); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
}
```

## 7、基数排序





## 8、堆排序





# 数组

## 1、两数之和

使用哈希表减少查询时间

```java
import java.util.*;
    
public class TwoSum{
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for(int i = 0; i < nums.length; i++){
            if(map.containsKey(target - nums[i])){
                return new int[]{map.get(target - nums[i]), i};
            }
            map.put(nums[i],i);
        }
        return new int[0];
	}
    
    public static void main(String[] args){
        int[] arr = {1,3,6,4,9};
        int target = 13;
        int[] result = twoSum(arr, target);
        System.out.println(Arrays.toString(result));
    }
}

```



# 链表

# 字符串

# 算法
