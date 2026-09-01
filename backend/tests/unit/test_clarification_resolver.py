import pytest
from app.core.interaction import ClarificationResolver, ClarificationContext


def test_candidate_option_1_and_2():
    resolver = ClarificationResolver()
    ctx = ClarificationContext(
        request_id="req1",
        question="Which Arun?",
        missing_information="target",
        candidate_options=["Arun College", "Arun Friend"],
    )

    res1 = resolver.resolve_answer(ctx, "1")
    assert res1.resolved is True
    assert res1.selected_option == "Arun College"

    res2 = resolver.resolve_answer(ctx, "2")
    assert res2.resolved is True
    assert res2.selected_option == "Arun Friend"


def test_natural_candidate_name():
    resolver = ClarificationResolver()
    ctx = ClarificationContext(
        request_id="req1",
        question="Which Arun?",
        missing_information="target",
        candidate_options=["Arun College", "Arun Friend"],
    )

    res = resolver.resolve_answer(ctx, "College")
    assert res.resolved is True
    assert res.selected_option == "Arun College"

    res_full = resolver.resolve_answer(ctx, "Arun friend")
    assert res_full.resolved is True
    assert res_full.selected_option == "Arun Friend"


def test_first_one_and_second_one():
    resolver = ClarificationResolver()
    ctx = ClarificationContext(
        request_id="req1",
        question="Which browser?",
        missing_information="browser",
        candidate_options=["Chrome", "Edge"],
    )

    res_first = resolver.resolve_answer(ctx, "the first one")
    assert res_first.resolved is True
    assert res_first.selected_option == "Chrome"

    res_second = resolver.resolve_answer(ctx, "second one")
    assert res_second.resolved is True
    assert res_second.selected_option == "Edge"


def test_invalid_answer_returns_unresolved():
    resolver = ClarificationResolver()
    ctx = ClarificationContext(
        request_id="req1",
        question="Which Arun?",
        missing_information="target",
        candidate_options=["Arun College", "Arun Friend"],
    )

    res = resolver.resolve_answer(ctx, "Bob")
    assert res.resolved is False
    assert res.selected_option is None
    assert "Could not match" in res.error_message


def test_cancellation_detection():
    resolver = ClarificationResolver()
    ctx = ClarificationContext(
        request_id="req1",
        question="Which Arun?",
        missing_information="target",
        candidate_options=["Arun College", "Arun Friend"],
    )

    for word in ["stop", "cancel", "never mind", "forget it"]:
        res = resolver.resolve_answer(ctx, word)
        assert res.resolved is False
        assert res.is_cancellation is True


def test_yes_no_confirmation():
    resolver = ClarificationResolver()
    ctx = ClarificationContext(
        request_id="req1",
        question="Should I use Chrome?",
        missing_information="confirmation",
        candidate_options=["yes", "no"],
    )

    res_yes = resolver.resolve_answer(ctx, "yeah")
    assert res_yes.resolved is True
    assert res_yes.is_confirmation is True
    assert res_yes.confirmation_value is True

    res_no = resolver.resolve_answer(ctx, "nope")
    assert res_no.resolved is True
    assert res_no.is_confirmation is True
    assert res_no.confirmation_value is False
