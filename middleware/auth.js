const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Obter o token do cabeçalho
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Adicionar informações do usuário ao objeto de requisição
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};
