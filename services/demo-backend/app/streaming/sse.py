import json
from typing import AsyncGenerator


async def sse_event(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


async def sse_generator(events: list[tuple[str, dict]]) -> AsyncGenerator[str, None]:
    for event, data in events:
        yield await sse_event(event, data)


def sse_stream(steps: list[tuple[str, dict]]):
    return sse_generator(steps)
