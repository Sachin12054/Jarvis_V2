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


class TaskState(str, Enum):
    PENDING = "PENDING"
    PLANNING = "PLANNING"
    READY = "READY"
    RUNNING = "RUNNING"
    WAITING = "WAITING"
    VERIFYING = "VERIFYING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class TaskStepState(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"
    CANCELLED = "CANCELLED"
