from mcp.server.fastmcp import FastMCP
import resend
import os

mcp = FastMCP("Mail")

@mcp.tool()
def send_email(subject: str, message: str, dest_address: str):
    """Sends an email to the specified address with the provided message"""
    try:
        resend_api_key = os.getenv("RESEND_API_KEY")
        resend.api_key = resend_api_key
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
        return f"ERROR: {str(e)}\n\nAPI_KEY: {resend_api_key}"

if __name__ == "__main__":
    mcp.run(transport="stdio")
    # print(send_email("Hello", "<b>Mensagem</b>", "delivered@resend.dev"))