import React, { useEffect, useState } from "react";
import { sendMessage } from "../api";

function formatCurrency(amount) {
  if (amount === undefined || amount === null) {
    return null;
  }

  return `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* ----------------------------- */
/* Reusable detail row           */
/* ----------------------------- */

function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="order-detail">
      <span className="order-label">{label}</span>
      <span className="order-value">{value}</span>
    </div>
  );
}

/* ----------------------------- */
/* Order card                    */
/* ----------------------------- */

function OrderCard({ data }) {
  if (!data) return null;

  return (
    <div className="order-card">
      <div className="order-card-title">
        📦 Order Information
      </div>

      <div className="order-details">

        <DetailRow
          label="Order ID"
          value={data.order_id}
        />

        <DetailRow
          label="Order Date"
          value={data.order_date}
        />

        <DetailRow
          label="Expected Delivery"
          value={data.expected_delivery}
        />

        <DetailRow
          label="Actual Delivery"
          value={data.actual_delivery}
        />

        {data.amount !== undefined && (
          <div className="order-detail">
            <span className="order-label">Amount</span>

            <span className="order-value amount">
              {formatCurrency(data.amount)}
            </span>
          </div>
        )}

        {data.order_status && (
          <div className="order-detail">
            <span className="order-label">Status</span>

            <span className="status-value">
              {data.order_status}
            </span>
          </div>
        )}

      </div>

      {data.finding && (
        <div className="order-finding">
          <strong>Finding</strong>
          <p>{data.finding}</p>
        </div>
      )}

      {data.action && (
        <div className="order-action">
          <strong>Next step</strong>
          <p>{data.action}</p>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- */
/* Payment card                  */
/* ----------------------------- */

function PaymentCard({ data }) {
  if (!data) return null;

  /*
   * Some Cura responses may contain a single payment object,
   * while billing responses can contain a payments array.
   */

  const payments = Array.isArray(data.payments)
    ? data.payments
    : data.payment_id
      ? [data]
      : [];

  return (
    <div className="order-card payment-card">

      <div className="order-card-title">
        💳 Payment Information
      </div>

      {/* Duplicate payment warning */}
      {data.duplicate_charge && (
        <div className="order-finding">
          <strong>⚠️ Possible duplicate payment</strong>

          {data.duplicate_count !== undefined && (
            <p>
              {data.duplicate_count} matching charges were found.
            </p>
          )}

          {data.duplicate_amount !== undefined && (
            <p>
              Duplicate amount:{" "}
              {formatCurrency(data.duplicate_amount)}
            </p>
          )}
        </div>
      )}

      {/* Payment list */}
      {payments.length > 0 && (
        <div className="order-details">

          {payments.map((payment, index) => (
            <div
              className="payment-item"
              key={payment.payment_id || index}
            >

              {payments.length > 1 && (
                <div className="payment-number">
                  Payment {index + 1}
                </div>
              )}

              <DetailRow
                label="Payment ID"
                value={payment.payment_id}
              />

              <DetailRow
                label="Order ID"
                value={payment.order_id}
              />

              {payment.amount !== undefined && (
                <div className="order-detail">
                  <span className="order-label">
                    Amount
                  </span>

                  <span className="order-value amount">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              )}

              <DetailRow
                label="Payment Date"
                value={payment.payment_date}
              />

              {payment.status && (
                <div className="order-detail">
                  <span className="order-label">
                    Status
                  </span>

                  <span className="status-value">
                    {payment.status}
                  </span>
                </div>
              )}

            </div>
          ))}

        </div>
      )}

      {data.finding && (
        <div className="order-finding">
          <strong>Finding</strong>
          <p>{data.finding}</p>
        </div>
      )}

      {data.refund_required && (
        <div className="order-action">
          <strong>Next step</strong>
          <p>
            {data.action ||
              "A refund may be required for the duplicate charge."}
          </p>
        </div>
      )}

      {!data.finding &&
        !data.refund_required &&
        data.action && (
          <div className="order-action">
            <strong>Next step</strong>
            <p>{data.action}</p>
          </div>
        )}

    </div>
  );
}

/* ----------------------------- */
/* Ticket card                   */
/* ----------------------------- */

function TicketCard({ data }) {
  if (!data) return null;

  const tickets = Array.isArray(data.tickets)
    ? data.tickets
    : data.ticket_id
      ? [data]
      : [];

  return (
    <div className="order-card ticket-card">

      <div className="order-card-title">
        🎫 Support Ticket Information
      </div>

      {tickets.length > 0 && (
        <div className="order-details">

          {tickets.map((ticket, index) => (
            <div
              className="ticket-item"
              key={ticket.ticket_id || index}
            >

              {tickets.length > 1 && (
                <div className="payment-number">
                  Ticket {index + 1}
                </div>
              )}

              <DetailRow
                label="Ticket ID"
                value={ticket.ticket_id}
              />

              <DetailRow
                label="Subject"
                value={ticket.subject}
              />

              {ticket.status && (
                <div className="order-detail">
                  <span className="order-label">
                    Status
                  </span>

                  <span className="status-value">
                    {ticket.status}
                  </span>
                </div>
              )}

              <DetailRow
                label="Priority"
                value={ticket.priority}
              />

              <DetailRow
                label="Created"
                value={ticket.created_at}
              />

            </div>
          ))}

        </div>
      )}

      {data.finding && (
        <div className="order-finding">
          <strong>Finding</strong>
          <p>{data.finding}</p>
        </div>
      )}

      {data.action && (
        <div className="order-action">
          <strong>Next step</strong>
          <p>{data.action}</p>
        </div>
      )}

      {tickets.length === 0 &&
        !data.finding &&
        !data.action && (
          <p className="order-finding">
            No additional ticket details were returned.
          </p>
        )}

    </div>
  );
}

/* ----------------------------- */
/* Generic data card              */
/* ----------------------------- */

function GenericDataCard({ data }) {
  if (!data || typeof data !== "object") {
    return null;
  }

  return (
    <div className="order-card">

      <div className="order-card-title">
        ✦ Cura Information
      </div>

      <div className="order-details">

        {Object.entries(data).map(([key, value]) => {

          if (
            value === null ||
            value === undefined ||
            typeof value === "object"
          ) {
            return null;
          }

          return (
            <DetailRow
              key={key}
              label={formatLabel(key)}
              value={String(value)}
            />
          );
        })}

      </div>

    </div>
  );
}

/* ----------------------------- */
/* Main response renderer         */
/* ----------------------------- */

function ResponseDetails({ response }) {
  if (!response || !response.data) {
    return null;
  }

  const intent = String(response.intent || "").toLowerCase();

  /*
   * Use the API intent to decide which card to display.
   * The internal intent name itself is NEVER displayed to the user.
   */

  if (
    intent.includes("order") ||
    intent.includes("delivery")
  ) {
    return <OrderCard data={response.data} />;
  }

  if (
    intent.includes("payment") ||
    intent.includes("billing")
  ) {
    return <PaymentCard data={response.data} />;
  }

  if (
    intent.includes("ticket") ||
    intent.includes("support")
  ) {
    return <TicketCard data={response.data} />;
  }

  return <GenericDataCard data={response.data} />;
}

/* ----------------------------- */
/* Main Chat component            */
/* ----------------------------- */

function Chat({ initialMessage = "" }) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  async function handleSend(customMessage = null) {
    const text = customMessage ?? message;

    if (!text.trim() || loading) {
      return;
    }

    setLoading(true);

    try {
      const data = await sendMessage("CUST001", text);

      console.log("Cura API response:", data);

      setResponse({
        ...data,
        userMessage: text,
      });

      setMessage("");

    } catch (error) {
      console.error("Cura API error:", error);

      setResponse({
        userMessage: text,
        error: true,
        message:
          "Unable to connect to the support server. Please make sure the Cura backend is running.",
      });
    }

    setLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function useSuggestion(text) {
    setMessage(text);
  }

  return (
    <div className="chat">

      {/* Welcome */}
      {!response && !loading && (
        <div className="chat-welcome">

          <div className="welcome-orb">
            ✦
          </div>

          <h3>
            How can I help you today?
          </h3>

          <p>
            Ask Cura about your orders, payments,
            tickets, or any support issue.
          </p>

          <div className="suggestion-row">

            <button
              type="button"
              onClick={() =>
                useSuggestion(
                  "Where is my latest order?"
                )
              }
            >
              📦 Latest order
            </button>

            <button
              type="button"
              onClick={() =>
                useSuggestion(
                  "Show me my payment information"
                )
              }
            >
              💳 Payments
            </button>

            <button
              type="button"
              onClick={() =>
                useSuggestion(
                  "Show me my support tickets"
                )
              }
            >
              🎫 Tickets
            </button>

          </div>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="ai-thinking">

          <div className="thinking-avatar">
            ✦
          </div>

          <div>
            <strong>
              Cura is investigating
            </strong>

            <div className="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

        </div>
      )}

      {/* Conversation */}
      {response && !loading && (
        <div className="conversation">

          {/* User message */}
          <div className="message user-message">

            <div className="message-label">
              You
            </div>

            <div className="message-bubble">
              {response.userMessage}
            </div>

          </div>

          {/* Cura response */}
          <div className="message ai-message">

            <div className="message-label">
              ✦ Cura AI
            </div>

            <div className="message-bubble">

              {response.error ? (

                <p>
                  {response.message}
                </p>

              ) : (

                <>

                  {/* Main message */}
                  {response.message && (
                    <p>
                      {response.message}
                    </p>
                  )}

                  {/* Detailed response */}
                  <ResponseDetails
                    response={response}
                  />

                  {/* Escalation */}
                  {response.escalated && (
                    <div className="order-action">

                      <strong>
                        🚨 Support escalation
                      </strong>

                      <p>
                        Your request has been
                        escalated for additional
                        assistance.
                      </p>

                    </div>
                  )}

                </>

              )}

            </div>

          </div>

        </div>
      )}

      {/* Input */}
      <div className="chat-input-area">

        <textarea
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask Cura anything about your account..."
          rows="2"
          disabled={loading}
        />

        <button
          type="button"
          className="send-button"
          onClick={() => handleSend()}
          disabled={
            loading ||
            !message.trim()
          }
        >
          {loading ? "..." : "➤"}
        </button>

      </div>

      <p className="chat-hint">
        Press Enter to send · Shift + Enter for a new line
      </p>

    </div>
  );
}

export default Chat;