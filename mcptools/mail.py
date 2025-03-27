#mail.py
from mcp.server.fastmcp import FastMCP
import resend

mcp = FastMCP("Mail")

@mcp.tool()
def send_email(subject: str, message: str, dest_address: str):
    """Sends an email to the specified address with the provided message"""
    try:
        

        params = {
            "from": "Acme <onboarding@resend.dev>",
            "to": ["delivered@resend.dev"],
            "subject": subject,
            "html": message
        }

        email = resend.Emails.send(params)
        return "Sucess"
    except:
        return "Failed"

if __name__ == "__main__":
    mcp.run(transport="stdio")