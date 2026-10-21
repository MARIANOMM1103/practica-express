cat > routes/pedidos.js << 'EOF'
import { Router } from 'express';

const router = Router();

// GET /api/pedidos/total/:cantidad/:precio
router.get('/total/:cantidad/:precio', (req, res) => {
  const cantidad = Number(req.params.cantidad);
  const precio = Number(req.params.precio);

  if (isNaN(cantidad) || isNaN(precio)) {
    return res.status(400).json({ mensaje: 'cantidad y precio deben ser números' });
  }

  const subtotal = cantidad * precio;
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  res.json({ subtotal, iva, total });
});

// GET /api/pedidos/descuento/:compra/:codigo
router.get('/descuento/:compra/:codigo', (req, res) => {
  const compra = Number(req.params.compra);
  const codigo = req.params.codigo;

  let porcentaje;
  if (codigo === 'VERANO10') {
    porcentaje = 0.10;
  } else if (codigo === 'MITAD') {
    porcentaje = 0.50;
  } else {
    return res.status(400).json({ mensaje: 'Código inválido' });
  }

  let montoFinal = compra - compra * porcentaje;
  if (montoFinal > 1000) {
    montoFinal = montoFinal * 0.95;
  }

  res.json({ compra, codigo, descuento: porcentaje * 100 + '%', montoFinal });
});

// POST /api/pedidos/promedio
router.post('/promedio', (req, res) => {
  const { calificaciones } = req.body;

  if (!Array.isArray(calificaciones) || calificaciones.length < 3) {
    return res.status(400).json({
      mensaje: 'calificaciones debe ser un arreglo con al menos 3 elementos'
    });
  }

  const suma = calificaciones.reduce((acc, c) => acc + c, 0);
  const promedio = Math.round((suma / calificaciones.length) * 100) / 100;

  let nivel;
  if (promedio >= 8) {
    nivel = 'excelente';
  } else if (promedio >= 6) {
    nivel = 'aceptable';
  } else {
    nivel = 'reprobado';
  }

  res.json({ promedio, nivel });
});

export default router;
EOF
