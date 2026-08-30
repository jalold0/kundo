// AsyncStorage'ning native qismi testda mavjud emas — rasmiy mock ishlatiladi.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
