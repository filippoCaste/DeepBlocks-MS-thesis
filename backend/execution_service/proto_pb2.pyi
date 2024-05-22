from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Parameters(_message.Message):
    __slots__ = ("key", "value")
    KEY_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    key: str
    value: str
    def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...

class Node(_message.Message):
    __slots__ = ("id", "label", "parameters")
    ID_FIELD_NUMBER: _ClassVar[int]
    LABEL_FIELD_NUMBER: _ClassVar[int]
    PARAMETERS_FIELD_NUMBER: _ClassVar[int]
    id: str
    label: str
    parameters: _containers.RepeatedCompositeFieldContainer[Parameters]
    def __init__(self, id: _Optional[str] = ..., label: _Optional[str] = ..., parameters: _Optional[_Iterable[_Union[Parameters, _Mapping]]] = ...) -> None: ...

class Edge(_message.Message):
    __slots__ = ("source", "target")
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    TARGET_FIELD_NUMBER: _ClassVar[int]
    source: str
    target: str
    def __init__(self, source: _Optional[str] = ..., target: _Optional[str] = ...) -> None: ...

class Network(_message.Message):
    __slots__ = ("nodes", "edges", "parameters")
    NODES_FIELD_NUMBER: _ClassVar[int]
    EDGES_FIELD_NUMBER: _ClassVar[int]
    PARAMETERS_FIELD_NUMBER: _ClassVar[int]
    nodes: _containers.RepeatedCompositeFieldContainer[Node]
    edges: _containers.RepeatedCompositeFieldContainer[Edge]
    parameters: _containers.RepeatedCompositeFieldContainer[Parameters]
    def __init__(self, nodes: _Optional[_Iterable[_Union[Node, _Mapping]]] = ..., edges: _Optional[_Iterable[_Union[Edge, _Mapping]]] = ..., parameters: _Optional[_Iterable[_Union[Parameters, _Mapping]]] = ...) -> None: ...

class NetworkResult(_message.Message):
    __slots__ = ("status", "message", "parameters")
    STATUS_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    PARAMETERS_FIELD_NUMBER: _ClassVar[int]
    status: str
    message: str
    parameters: _containers.RepeatedCompositeFieldContainer[Parameters]
    def __init__(self, status: _Optional[str] = ..., message: _Optional[str] = ..., parameters: _Optional[_Iterable[_Union[Parameters, _Mapping]]] = ...) -> None: ...
