import { API_BASE_URL } from '../constants/apiEndpoints';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const toAbsoluteMediaUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  if (url.startsWith('/')) {
    return `${API_ORIGIN}${url}`;
  }

  return `${API_ORIGIN}/${url}`;
};

export const normalizeUserFromBackend = (user) => {
  if (!user) {
    return null;
  }

  const rawAvatar = user.avatar || user.profileImage || null;
  const avatar = toAbsoluteMediaUrl(rawAvatar);
  const phone = user.phone ?? user.phoneNumber ?? '';
  const location =
    user.location ?? [user.city, user.department].filter(Boolean).join(', ');

  return {
    ...user,
    avatar,
    profileImage: avatar,
    phone,
    phoneNumber: user.phoneNumber ?? phone,
    location,
  };
};

export const toBackendProfilePayload = (profileData = {}) => {
  const payload = {};

  if (typeof profileData.firstName === 'string') {
    payload.firstName = profileData.firstName;
  }

  if (typeof profileData.lastName === 'string') {
    payload.lastName = profileData.lastName;
  }

  const phoneNumber = (profileData.phoneNumber ?? profileData.phone ?? '').trim();
  if (phoneNumber) {
    payload.phoneNumber = phoneNumber;
  }

  const profileImage = profileData.profileImage ?? profileData.avatar;
  if (typeof profileImage === 'string' && profileImage.trim()) {
    payload.profileImage = profileImage.trim();
  }

  let city = (profileData.city ?? '').trim();
  let department = (profileData.department ?? '').trim();

  if (!city && !department && typeof profileData.location === 'string' && profileData.location.trim()) {
    const [parsedCity, ...rest] = profileData.location
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);

    city = parsedCity ?? '';
    department = rest.join(', ');
  }

  if (city) {
    payload.city = city;
  }

  if (department) {
    payload.department = department;
  }

  if (typeof profileData.bio === 'string') {
    payload.bio = profileData.bio;
  }

  return payload;
};