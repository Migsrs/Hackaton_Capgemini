from mcp.server.fastmcp import FastMCP
import resend
from dotenv import load_dotenv
from pathlib import Path
import os

mcp = FastMCP("Mail")

@mcp.tool()
def send_email(subject: str, message: str, dest_address: str):
    """Sends an email to the specified address with the provided message"""
    return "Success"
    load_dotenv(Path(__file__).parent.parent /".env")
    resend.api_key = os.environ["RESEND_API_KEY"]
    try:
        print(f"Subject: {subject}\nMessage: {message}\nDestination: {dest_address}\n\n")
        params = {
            "from": "Acme <onboarding@resend.dev>",
            "to": ["delivered@resend.dev"],
            "subject": subject,
            "html": message
        }

        email = resend.Emails.send(params)
        return "Sucess"
    except Exception as e:
        print(str(e))
        return "Failed"

if __name__ == "__main__":
    mcp.run(transport="stdio")
    # print(send_email("Hello", "<b>Mensagem</b>", "delivered@resend.dev"))