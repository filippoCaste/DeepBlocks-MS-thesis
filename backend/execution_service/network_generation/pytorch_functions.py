# network_creation/pytorch_functions.py

valid_pytorch_functions = {
    "BatchNorm1d": "torch.nn.BatchNorm1d",
    "BatchNorm2d": "torch.nn.BatchNorm2d",
    "LayerNorm": "torch.nn.LayerNorm",
    "add": "torch.add",
    "sub": "torch.sub",
    "mul": "torch.mul",
    "div": "torch.div",
    "Dropout": "torch.nn.Dropout",
    "Sigmoid": "torch.nn.Sigmoid",
    "Tanh": "torch.nn.Tanh",
    "ReLU": "torch.nn.ReLU",
    "LeakyReLU": "torch.nn.LeakyReLU",
    "Softmax": "torch.nn.Softmax",
    "MultiheadAttention": "torch.nn.MultiheadAttention",
    "Conv1d": "torch.nn.Conv1d",
    "MaxPool1d": "torch.nn.MaxPool1d",
    "AvgPool1d": "torch.nn.AvgPool1d",
    "Conv2d": "torch.nn.Conv2d",
    "MaxPool2d": "torch.nn.MaxPool2d",
    "AvgPool2d": "torch.nn.AvgPool2d",
    "Flatten": "torch.nn.Flatten",
    "Linear": "torch.nn.Linear",
}

function_params = {
    'torch.nn.BatchNorm1d': {
        'num_features': int,
        'eps': float,
        'momentum': float,
        'affine': bool,
        'track_running_stats': bool
    },
    'torch.nn.BatchNorm2d': {
        'num_features': int,
        'eps': float,
        'momentum': float,
        'affine': bool,
        'track_running_stats': bool
    },
    'torch.nn.LayerNorm': {
        'normalized_shape': tuple,
        'eps': float,
        'elementwise_affine': bool
    },
    'torch.nn.Dropout': {
        'p': float,
        'inplace': bool
    },
    'torch.nn.Sigmoid': {},
    'torch.nn.Tanh': {},
    'torch.nn.ReLU': {
        'inplace': bool
    },
    'torch.nn.LeakyReLU': {
        'negative_slope': float,
        'inplace': bool
    },
    'torch.nn.Softmax': {
        'dim': int
    },
    'torch.nn.MultiheadAttention': {
        'embed_dim': int,
        'num_heads': int,
        'dropout': float,
        'bias': bool,
        'add_bias_kv': bool,
        'add_zero_attn': bool,
        'kdim': int,
        'vdim': int
    },
    'torch.nn.Conv1d': {
        'in_channels': int,
        'out_channels': int,
        'kernel_size': int,
        'stride': int,
        'padding': int,
        'dilation': int,
        'bias': bool
    },
    'torch.nn.MaxPool1d': {
        'kernel_size': tuple,
        'stride': tuple,
        'padding': tuple,
        'ceil_mode': bool,
    },
        'torch.nn.AvgPool1d': {
        'kernel_size': tuple,
        'stride': tuple,
        'padding': tuple,
        'ceil_mode': bool,
        'count_include_pad': bool,
        'divisor_override': int
    },
    'torch.nn.Conv2d': {
        'in_channels': int,
        'out_channels': int,
        'kernel_size': int,
        'stride': int,
        'padding': int,
        'dilation': int,
        'bias': bool
    },
    'torch.nn.MaxPool2d': {
        'kernel_size': tuple,
        'stride': tuple,
        'padding': tuple,
        'dilation': tuple,
        'return_indices': bool,
        'ceil_mode': bool
    },
    'torch.nn.AvgPool2d': {
        'kernel_size': tuple,
        'stride': tuple,
        'padding': tuple,
        'ceil_mode': bool,
        'count_include_pad': bool,
        'divisor_override': int
    },
    'torch.nn.Flatten': {
        'start_dim': int,
        'end_dim': int
    },
    'torch.nn.Linear': {
        'in_features': int,
        'out_features': int,
        'bias': bool
    }
}