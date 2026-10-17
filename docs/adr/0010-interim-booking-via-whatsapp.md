# 0010. Interim room booking through a WhatsApp deep link

## Status
Accepted

## Context
Online room booking with payments is a planned future phase, but the
launch version still needs a clear way for visitors to ask about and
reserve a room. The client already takes enquiries on WhatsApp.

## Decision
Each room card shows a "Book now" link that opens a WhatsApp chat with the
hotel's number (`https://wa.me/<number>?text=<message>`). The message is
fixed wording written in code (`src/lib/booking.ts`) with the hotel and room
names inserted. The number comes from Site Settings; with no number saved,
the button is not rendered.

## Alternatives Considered
- **A booking form that emails the hotel**: needs an email service and spam
  protection, and the client would still have to reply by hand.
- **The WhatsApp Business API**: allows automation, but needs a business
  account, approval, and paid messaging, which is out of scope for a free
  toolchain.
- **Phone and email links only**: already present, but a pre-filled message
  that names the room removes friction for the visitor.

## Consequences
- Positive: no new dependencies, no data stored, works on phones and
  desktops, and the room the visitor chose is identified for the client.
- Negative: no availability checking or payment, and no record of enquiries
  on the site itself. Both are addressed by the future online booking
  feature, which will replace or sit beside this button.
