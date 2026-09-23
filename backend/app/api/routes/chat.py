from fastapi import APIRouter, HTTPException

from backend.app.schemas.chat import ChatRequest, ChatResponse
from backend.app.services.customer_service import CustomerService
from backend.app.services.order_service import OrderService
from backend.app.services.payment_service import PaymentService
from backend.app.services.ticket_service import TicketService
from backend.app.services.escalation_service import EscalationService


router = APIRouter(prefix="/chat", tags=["Chat"])

customer_service = CustomerService()
order_service = OrderService()
payment_service = PaymentService()
ticket_service = TicketService()
escalation_service = EscalationService()


def contains_any(message: str, keywords: list[str]) -> bool:
    return any(keyword in message for keyword in keywords)


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    customer = customer_service.get_customer(request.customer_id)

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    message = request.message.lower().strip()

    # --------------------------------------------------
    # ESCALATION / HUMAN SUPPORT
    # --------------------------------------------------

    escalation_keywords = [
        "human",
        "agent",
        "representative",
        "real person",
        "speak to someone",
        "talk to someone",
        "customer support",
        "escalate",
        "manager",
    ]

    if contains_any(message, escalation_keywords):
        escalation = escalation_service.create_escalation(
            customer_id=request.customer_id,
            reason=request.message,
        )

        return ChatResponse(
            customer_id=request.customer_id,
            message="Your issue has been escalated for human review.",
            intent="escalation",
            data=escalation,
            escalated=True,
        )

    # --------------------------------------------------
    # REFUND / MONEY BACK
    # --------------------------------------------------

    refund_phrases = [
        "refund",
        "money back",
        "get my money back",
        "want my money back",
        "give my money back",
        "return my money",
        "i want a refund",
        "can i get a refund",
    ]

    if contains_any(message, refund_phrases):
        payments = payment_service.get_customer_payments(
            request.customer_id
        )

        return ChatResponse(
            customer_id=request.customer_id,
            message=(
                "I can help you with that. "
                "Let me check your payment information."
            ),
            intent="refund",
            data={"payments": payments},
        )


    # --------------------------------------------------
    # PAYMENT / BILLING
    # --------------------------------------------------

    payment_keywords = [
        "payment",
        "payments",
        "billing",
        "bill",
        "charged",
        "charge",
        "refund",
        "refunded",
        "money",
        "paid",
        "pay",
        "transaction",
        "transactions",
        "duplicate charge",
        "charged twice",
        "charged two times",
        "wrong charge",
    ]

    if contains_any(message, payment_keywords):
        payments = payment_service.get_customer_payments(
            request.customer_id
        )

        return ChatResponse(
            customer_id=request.customer_id,
            message="Here is your payment information.",
            intent="payment",
            data={"payments": payments},
        )

    # --------------------------------------------------
    # SUPPORT TICKETS
    # --------------------------------------------------

    ticket_keywords = [
        "ticket",
        "tickets",
        "complaint",
        "complaints",
        "support request",
        "support requests",
        "case",
        "cases",
        "issue reported",
        "reported issue",
        "previous issue",
        "previous complaint",
    ]

    if contains_any(message, ticket_keywords):
        tickets = ticket_service.get_customer_tickets(
            request.customer_id
        )

        return ChatResponse(
            customer_id=request.customer_id,
            message="Here is your ticket information.",
            intent="ticket",
            data={"tickets": tickets},
        )

    # --------------------------------------------------
    # ORDER / DELIVERY
    # --------------------------------------------------

    order_keywords = [
        "order",
        "orders",
        "package",
        "parcel",
        "delivery",
        "delivered",
        "arrive",
        "arrival",
        "shipping",
        "shipment",
        "tracking",
        "track",
        "courier",
        "late",
        "delayed",
        "delay",
        "not arrived",
        "hasn't arrived",
        "has not arrived",
        "where is my",
        "when will it arrive",
    ]

    if contains_any(message, order_keywords):
        order = order_service.get_latest_customer_order(
            request.customer_id
        )

        return ChatResponse(
            customer_id=request.customer_id,
            message="Here is your latest order information.",
            intent="order_status",
            data=order,
        )

    # --------------------------------------------------
    # GENERAL SUPPORT FALLBACK
    # --------------------------------------------------

    return ChatResponse(
        customer_id=request.customer_id,
        message=(
            "I can help with orders, deliveries, payments, "
            "refunds, support tickets, and human support. "
            "Please tell me what you need help with."
        ),
        intent="general_support",
        data=None,
        escalated=False,
    )