

export const loadSampleDataFactorial = (setSignature: (signature: string) => void, setDescription: (description: string) => void, setModel: (model: string) => void, setTestCasesJson: (testCasesJson: string) => void) => {
    // Set function signature
    setSignature("def factorial(n: int) -> int");

    // Set description
    setDescription("Compute the factorial of a given number n.");

    // Set model
    setModel("gpt-4o-2024-08-06");

    // Set test cases as JSON
    const sampleTestCases = [
        {
            inputs: { n: 0 },
            input_types: { n: "int" },
            expected_output: 1,
            expected_output_type: "int",
        },
        {
            inputs: { n: 1 },
            input_types: { n: "int" },
            expected_output: 1,
            expected_output_type: "int",
        },
        {
            inputs: { n: 5 },
            input_types: { n: "int" },
            expected_output: 120,
            expected_output_type: "int",
        },
        {
            inputs: { n: 7 },
            input_types: { n: "int" },
            expected_output: 5040,
            expected_output_type: "int",
        },
    ];

    setTestCasesJson(JSON.stringify(sampleTestCases, null, 2));
};

export const loadSampleDataMatrixMultiplication = (setSignature: (signature: string) => void, setDescription: (description: string) => void, setModel: (model: string) => void, setTestCasesJson: (testCasesJson: string) => void) => {
    // Set function signature
    setSignature(
        "def matrix_multiplication(A: List[List[int]], B: List[List[int]]) -> List[List[int]]"
    );

    // Set description
    setDescription("Multiply two matrices A and B.");

    // Set model
    setModel("gpt-4o-2024-08-06");

    // Set test cases as JSON
    const sampleTestCases = [
        {
            inputs: {
                A: [
                    [1, 2],
                    [3, 4],
                ],
                B: [
                    [5, 6],
                    [7, 8],
                ],
            },
            input_types: { A: "List[List[int]]", B: "List[List[int]]" },
            expected_output: [
                [19, 22],
                [43, 50],
            ],
            expected_output_type: "List[List[int]]",
        },
        {
            inputs: {
                A: [
                    [1, 0],
                    [0, 1],
                ],
                B: [
                    [9, 8],
                    [7, 6],
                ],
            },
            input_types: { A: "List[List[int]]", B: "List[List[int]]" },
            expected_output: [
                [9, 8],
                [7, 6],
            ],
            expected_output_type: "List[List[int]]",
        },
        {
            inputs: {
                A: [
                    [1, 2, 3],
                    [4, 5, 6],
                ],
                B: [
                    [7, 8],
                    [9, 10],
                    [11, 12],
                ],
            },
            input_types: { A: "List[List[int]]", B: "List[List[int]]" },
            expected_output: [
                [58, 64],
                [139, 154],
            ],
            expected_output_type: "List[List[int]]",
        },
    ];

    setTestCasesJson(JSON.stringify(sampleTestCases, null, 2));
};

export const loadSampleDataForReverseString = (setSignature: (signature: string) => void, setDescription: (description: string) => void, setModel: (model: string) => void, setTestCasesJson: (testCasesJson: string) => void) => {
    // Set function signature
    setSignature("def reverse_string(s: str) -> str");

    // Set description
    setDescription("Reverses the input string s.");

    // Set model
    setModel("gpt-4o-2024-08-06");

    // Set test cases as JSON
    const sampleTestCases = [
        {
            inputs: { s: "" },
            input_types: { s: "str" },
            expected_output: "",
            expected_output_type: "str",
        },
        {
            inputs: { s: "hello" },
            input_types: { s: "str" },
            expected_output: "olleh",
            expected_output_type: "str",
        },
        {
            inputs: { s: "racecar" },
            input_types: { s: "str" },
            expected_output: "racecar",
            expected_output_type: "str",
        },
        {
            inputs: { s: "ChatGPT" },
            input_types: { s: "str" },
            expected_output: "TPGtahC",
            expected_output_type: "str",
        },
    ];

    setTestCasesJson(JSON.stringify(sampleTestCases, null, 2));
};

export const loadSampleDataFibonacci = (
    setSignature: (signature: string) => void,
    setDescription: (description: string) => void,
    setModel: (model: string) => void,
    setTestCasesJson: (testCasesJson: string) => void
) => {
    // Set function signature
    setSignature("def fibonacci(n: int) -> int");

    // Set description
    setDescription("Compute the nth Fibonacci number where fibonacci(0)=0 and fibonacci(1)=1.");

    // Set model
    setModel("gpt-4o-2024-08-06");

    // Set test cases as JSON
    const sampleTestCases = [
        {
            inputs: { n: 0 },
            input_types: { n: "int" },
            expected_output: 0,
            expected_output_type: "int",
        },
        {
            inputs: { n: 1 },
            input_types: { n: "int" },
            expected_output: 1,
            expected_output_type: "int",
        },
        {
            inputs: { n: 5 },
            input_types: { n: "int" },
            expected_output: 5,
            expected_output_type: "int",
        },
        {
            inputs: { n: 10 },
            input_types: { n: "int" },
            expected_output: 55,
            expected_output_type: "int",
        },
    ];

    setTestCasesJson(JSON.stringify(sampleTestCases, null, 2));
};

export const loadSampleDataIsPrime = (
    setSignature: (signature: string) => void,
    setDescription: (description: string) => void,
    setModel: (model: string) => void,
    setTestCasesJson: (testCasesJson: string) => void
) => {
    // Set function signature
    setSignature("def is_prime(n: int) -> bool");

    // Set description
    setDescription("Determine whether the given number n is a prime number.");

    // Set model
    setModel("gpt-4o-2024-08-06");

    // Set test cases as JSON
    const sampleTestCases = [
        {
            inputs: { n: 1 },
            input_types: { n: "int" },
            expected_output: false,
            expected_output_type: "bool",
        },
        {
            inputs: { n: 2 },
            input_types: { n: "int" },
            expected_output: true,
            expected_output_type: "bool",
        },
        {
            inputs: { n: 15 },
            input_types: { n: "int" },
            expected_output: false,
            expected_output_type: "bool",
        },
        {
            inputs: { n: 17 },
            input_types: { n: "int" },
            expected_output: true,
            expected_output_type: "bool",
        },
    ];

    setTestCasesJson(JSON.stringify(sampleTestCases, null, 2));
};

export const loadSampleDataSumArray = (
    setSignature: (signature: string) => void,
    setDescription: (description: string) => void,
    setModel: (model: string) => void,
    setTestCasesJson: (testCasesJson: string) => void
) => {
    // Set function signature
    setSignature("def sum_array(arr: List[int]) -> int");

    // Set description
    setDescription("Calculate the sum of all elements in the integer array arr.");

    // Set model
    setModel("gpt-4o-2024-08-06");

    // Set test cases as JSON
    const sampleTestCases = [
        {
            inputs: { arr: [] },
            input_types: { arr: "List[int]" },
            expected_output: 0,
            expected_output_type: "int",
        },
        {
            inputs: { arr: [1, 2, 3] },
            input_types: { arr: "List[int]" },
            expected_output: 6,
            expected_output_type: "int",
        },
        {
            inputs: { arr: [-1, 1, 0] },
            input_types: { arr: "List[int]" },
            expected_output: 0,
            expected_output_type: "int",
        },
        {
            inputs: { arr: [10, 20, 30, 40] },
            input_types: { arr: "List[int]" },
            expected_output: 100,
            expected_output_type: "int",
        },
    ];

    setTestCasesJson(JSON.stringify(sampleTestCases, null, 2));
};
