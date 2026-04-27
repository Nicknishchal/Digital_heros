from typing import Any, Generic, List, Optional, Type, TypeVar, Union
from beanie import Document
from pydantic import BaseModel

DocType = TypeVar("DocType", bound=Document)

class BaseRepository(Generic[DocType]):
    def __init__(self, model: Type[DocType]):
        self.model = model

    async def get(self, id: Any) -> Optional[DocType]:
        return await self.model.get(id)

    async def get_multi(self, *, skip: int = 0, limit: int = 100) -> List[DocType]:
        return await self.model.all(skip=skip, limit=limit).to_list()

    async def create(self, obj_in: DocType) -> DocType:
        return await obj_in.insert()

    async def update(self, db_obj: DocType, obj_in: Union[dict, Any]) -> DocType:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        
        await db_obj.save()
        return db_obj

    async def remove(self, id: Any) -> Optional[DocType]:
        obj = await self.get(id)
        if obj:
            await obj.delete()
        return obj
