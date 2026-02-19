const maquinasData = [
  {
    id: 1,
    nombre: "ZONA CARDIO",
    descripcion: "Caminadoras, bicicletas y elípticas para mejorar resistencia.",
  },
  {
    id: 2,
    nombre: "TREN SUPERIOR",
    descripcion: "Máquinas para pecho, espalda, brazos y hombros.",
  },
  {
    id: 3,
    nombre: "TREN INFERIOR",
    descripcion: "Prensa, extensiones y equipos para piernas.",
  },
];

export const getMaquinas = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (Math.random() < 0.2) {
    throw new Error("No se pudieron cargar las máquinas. Intenta nuevamente.");
  }

  return maquinasData;
};

const productosData = [
  {
    id: 1,
    nombre: "Proteína Whey",
    descripcion:
      "Suplemento que ayuda a aumentar la fuerza y mejorar el rendimiento.",
  },
  {
    id: 2,
    nombre: "Proteína Recovery",
    descripcion:
      "Suplemento proteico que apoya la recuperación muscular.",
  },
  {
    id: 3,
    nombre: "Pre Entreno",
    descripcion:
      "Suplemento formulado para aumentar la energía y la intensidad.",
  },
];

const bebidasData = [
  {
    id: 1,
    nombre: "Bebida Energética",
    descripcion:
      "Bebida energética diseñada para hidratar y potenciar tu rendimiento.",
  },
  {
    id: 2,
    nombre: "Bebida Proteica",
    descripcion:
      "Ideal para apoyar la recuperación después del entrenamiento.",
  },
  {
    id: 3,
    nombre: "Bebida Funcional",
    descripcion:
      "Ayuda a mantener la energía y el enfoque durante el ejercicio.",
  },
];

export const getProductos = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (Math.random() < 0.2) {
    throw new Error("No se pudieron cargar los productos. Intenta nuevamente.");
  }

  return { productos: productosData, bebidas: bebidasData };
};

const serviciosData = [
  {
    id: 1,
    titulo: "Usuarios",
    descripcion: "Registro de clientes, historial y control de accesos.",
  },
  {
    id: 2,
    titulo: "Membresías",
    descripcion: "Control de precios, vencimientos y pagos.",
  },
  {
    id: 3,
    titulo: "Entrenadores",
    descripcion: "Horarios, entrenamientos y disponibilidad.",
  },
];

export const getServicios = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (Math.random() < 0.2) {
    throw new Error("No se pudieron cargar los servicios.");
  }

  return serviciosData;
};

export const loginUser = async ({ email, password }) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const validEmail = "admin@gmail.com";
  const validPassword = "12345678";

  if (email === validEmail && password === validPassword) {
    return {
      token: "fake-jwt-token",
      role: "ADMIN",
    };
  }

  throw new Error("Usuario o contraseña incorrectos.");
};

