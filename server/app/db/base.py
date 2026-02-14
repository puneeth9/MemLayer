# Import all models here so that Base.metadata picks them up
# for create_all / Alembic autogenerate.

from app.db.session import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.chat import Chat  # noqa: F401
from app.models.message import Message  # noqa: F401
