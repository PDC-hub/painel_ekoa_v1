import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { query, executeProcedure } from '../config/database';

// GET /api/users - Listar todos os usuários
export async function getUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const role = request.query.get('role');
    const classId = request.query.get('classId');

    let sqlQuery = 'SELECT * FROM Users WHERE isActive = 1';
    const params: { name: string; value: unknown }[] = [];

    if (role) {
      sqlQuery += ' AND role = @role';
      params.push({ name: 'role', value: role });
    }

    if (classId) {
      sqlQuery += ' AND classId = @classId';
      params.push({ name: 'classId', value: classId });
    }

    sqlQuery += ' ORDER BY name';

    const users = await query(sqlQuery, params);

    return {
      status: 200,
      jsonBody: { success: true, data: users },
    };
  } catch (error) {
    context.error('Error fetching users:', error);
    return {
      status: 500,
      jsonBody: { success: false, error: 'Erro ao buscar usuários' },
    };
  }
}

// GET /api/users/{id} - Buscar usuário por ID
export async function getUserById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const id = request.params.id;
    const users = await query('SELECT * FROM Users WHERE id = @id AND isActive = 1', [{ name: 'id', value: id }]);

    if (users.length === 0) {
      return {
        status: 404,
        jsonBody: { success: false, error: 'Usuário não encontrado' },
      };
    }

    return {
      status: 200,
      jsonBody: { success: true, data: users[0] },
    };
  } catch (error) {
    context.error('Error fetching user:', error);
    return {
      status: 500,
      jsonBody: { success: false, error: 'Erro ao buscar usuário' },
    };
  }
}

// POST /api/users - Criar novo usuário (ou atualizar existente do Azure AD)
export async function createUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const body = await request.json() as {
      id: string;
      email: string;
      name: string;
      role: string;
      classId?: string;
    };

    // Verificar se usuário já existe
    const existing = await query('SELECT id FROM Users WHERE id = @id', [{ name: 'id', value: body.id }]);

    if (existing.length > 0) {
      // Atualizar último login
      await query(
        'UPDATE Users SET lastLogin = GETDATE(), email = @email, name = @name WHERE id = @id',
        [
          { name: 'id', value: body.id },
          { name: 'email', value: body.email },
          { name: 'name', value: body.name },
        ]
      );

      return {
        status: 200,
        jsonBody: { success: true, message: 'Usuário atualizado' },
      };
    }

    // Criar novo usuário
    await query(
      `INSERT INTO Users (id, email, name, role, classId, createdAt, lastLogin)
       VALUES (@id, @email, @name, @role, @classId, GETDATE(), GETDATE())`,
      [
        { name: 'id', value: body.id },
        { name: 'email', value: body.email },
        { name: 'name', value: body.name },
        { name: 'role', value: body.role },
        { name: 'classId', value: body.classId || null },
      ]
    );

    return {
      status: 201,
      jsonBody: { success: true, message: 'Usuário criado' },
    };
  } catch (error) {
    context.error('Error creating user:', error);
    return {
      status: 500,
      jsonBody: { success: false, error: 'Erro ao criar usuário' },
    };
  }
}

// PUT /api/users/{id} - Atualizar usuário
export async function updateUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const id = request.params.id;
    const body = await request.json() as {
      name?: string;
      classId?: string;
      guildId?: string;
      level?: number;
      xp?: number;
      stats?: {
        strength?: number;
        intelligence?: number;
        wisdom?: number;
        dexterity?: number;
        constitution?: number;
        charisma?: number;
      };
    };

    const updates: string[] = [];
    const params: { name: string; value: unknown }[] = [{ name: 'id', value: id }];

    if (body.name) {
      updates.push('name = @name');
      params.push({ name: 'name', value: body.name });
    }
    if (body.classId !== undefined) {
      updates.push('classId = @classId');
      params.push({ name: 'classId', value: body.classId });
    }
    if (body.guildId !== undefined) {
      updates.push('guildId = @guildId');
      params.push({ name: 'guildId', value: body.guildId });
    }
    if (body.level !== undefined) {
      updates.push('level = @level');
      params.push({ name: 'level', value: body.level });
    }
    if (body.xp !== undefined) {
      updates.push('xp = @xp');
      params.push({ name: 'xp', value: body.xp });
    }
    if (body.stats) {
      if (body.stats.strength !== undefined) {
        updates.push('strength = @strength');
        params.push({ name: 'strength', value: body.stats.strength });
      }
      if (body.stats.intelligence !== undefined) {
        updates.push('intelligence = @intelligence');
        params.push({ name: 'intelligence', value: body.stats.intelligence });
      }
      if (body.stats.wisdom !== undefined) {
        updates.push('wisdom = @wisdom');
        params.push({ name: 'wisdom', value: body.stats.wisdom });
      }
      if (body.stats.dexterity !== undefined) {
        updates.push('dexterity = @dexterity');
        params.push({ name: 'dexterity', value: body.stats.dexterity });
      }
      if (body.stats.constitution !== undefined) {
        updates.push('constitution = @constitution');
        params.push({ name: 'constitution', value: body.stats.constitution });
      }
      if (body.stats.charisma !== undefined) {
        updates.push('charisma = @charisma');
        params.push({ name: 'charisma', value: body.stats.charisma });
      }
    }

    if (updates.length === 0) {
      return {
        status: 400,
        jsonBody: { success: false, error: 'Nenhum campo para atualizar' },
      };
    }

    const sqlQuery = `UPDATE Users SET ${updates.join(', ')} WHERE id = @id`;
    await query(sqlQuery, params);

    return {
      status: 200,
      jsonBody: { success: true, message: 'Usuário atualizado' },
    };
  } catch (error) {
    context.error('Error updating user:', error);
    return {
      status: 500,
      jsonBody: { success: false, error: 'Erro ao atualizar usuário' },
    };
  }
}

// DELETE /api/users/{id} - Desativar usuário (soft delete)
export async function deleteUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const id = request.params.id;
    await query('UPDATE Users SET isActive = 0 WHERE id = @id', [{ name: 'id', value: id }]);

    return {
      status: 200,
      jsonBody: { success: true, message: 'Usuário desativado' },
    };
  } catch (error) {
    context.error('Error deleting user:', error);
    return {
      status: 500,
      jsonBody: { success: false, error: 'Erro ao desativar usuário' },
    };
  }
}

// GET /api/users/{id}/inventory - Inventário do usuário
export async function getUserInventory(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const id = request.params.id;
    const inventory = await query(
      `SELECT i.*, inv.quantity, inv.equipped, inv.acquiredAt
       FROM Inventory inv
       JOIN Items i ON inv.itemId = i.id
       WHERE inv.userId = @id`,
      [{ name: 'id', value: id }]
    );

    return {
      status: 200,
      jsonBody: { success: true, data: inventory },
    };
  } catch (error) {
    context.error('Error fetching inventory:', error);
    return {
      status: 500,
      jsonBody: { success: false, error: 'Erro ao buscar inventário' },
    };
  }
}

// POST /api/users/{id}/xp - Adicionar XP
export async function addUserXP(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const id = request.params.id;
    const body = await request.json() as { xpAmount: number };

    await executeProcedure('sp_AddUserXP', [
      { name: 'userId', value: id },
      { name: 'xpAmount', value: body.xpAmount },
    ]);

    // Retornar dados atualizados do usuário
    const users = await query('SELECT * FROM Users WHERE id = @id', [{ name: 'id', value: id }]);

    return {
      status: 200,
      jsonBody: { success: true, data: users[0] },
    };
  } catch (error) {
    context.error('Error adding XP:', error);
    return {
      status: 500,
      jsonBody: { success: false, error: 'Erro ao adicionar XP' },
    };
  }
}

// Registrar rotas
app.http('getUsers', {
  methods: ['GET'],
  route: 'users',
  handler: getUsers,
});

app.http('getUserById', {
  methods: ['GET'],
  route: 'users/{id}',
  handler: getUserById,
});

app.http('createUser', {
  methods: ['POST'],
  route: 'users',
  handler: createUser,
});

app.http('updateUser', {
  methods: ['PUT'],
  route: 'users/{id}',
  handler: updateUser,
});

app.http('deleteUser', {
  methods: ['DELETE'],
  route: 'users/{id}',
  handler: deleteUser,
});

app.http('getUserInventory', {
  methods: ['GET'],
  route: 'users/{id}/inventory',
  handler: getUserInventory,
});

app.http('addUserXP', {
  methods: ['POST'],
  route: 'users/{id}/xp',
  handler: addUserXP,
});
