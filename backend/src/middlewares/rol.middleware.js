export const permitirSoloRol = (rolPermitido) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Token no proporcionado o inválido' });
    }

    if (req.usuario.rol !== rolPermitido) {
      return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
    }

    next();
  };
};
