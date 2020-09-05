export const FILE_SYSTEMS = /\/nvme|^\/dev\/sd/i;
export const inDockerSys = process.env.NODE_ENV === 'docker';
