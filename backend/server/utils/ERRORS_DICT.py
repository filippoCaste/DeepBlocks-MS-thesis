error_solutions = {
    "CUDA out of memory": "Try reducing the batch size or using a smaller model.",
    "Expected object of scalar type": "Ensure that your tensor types match.",
    "size mismatch": "Check the dimensions of your tensors and model layers.",
    "Shapes of outputs": "Check the batch size and the database labels, they should match.",
    "AssertionError": "Verify the assertions in your code, they might be failing due to unexpected conditions.",
    r"to have \d+ channels, but got \d+ channels instead": "Verify the input or output channels of the indicated node.",
}
