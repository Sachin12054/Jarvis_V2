from enum import Enum


class InputChannel(str, Enum):
    VOICE = "voice"
    TEXT = "text"
    SYSTEM = "system"
    MOBILE = "mobile"


class TargetDevice(str, Enum):
    CURRENT = "current"
    LAPTOP = "laptop"
    PHONE = "phone"
    BOTH = "both"
    UNKNOWN = "unknown"


class DecisionStrategy(str, Enum):
    DIRECT_ACTION = "DIRECT_ACTION"
    KNOWLEDGE_QUERY = "KNOWLEDGE_QUERY"
    TOOL_CALL = "TOOL_CALL"
    COMPLEX_TASK = "COMPLEX_TASK"
    CLARIFICATION = "CLARIFICATION"
    CANCEL = "CANCEL"
    NO_OP = "NO_OP"


class ExecutionStatus(str, Enum):
    REQUESTED = "requested"
    STARTED = "started"
    EXECUTED = "executed"
    VERIFIED = "verified"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ResponseType(str, Enum):
    TEXT = "text"
    VOICE = "voice"
    ACTION = "action"
    CLARIFICATION = "clarification"
    ERROR = "error"
