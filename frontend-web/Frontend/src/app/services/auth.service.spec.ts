import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a login method', () => {
    expect(service.logIn).toBeTruthy();
  });

  it('should have a logout method', () => {
    expect(service.logOut).toBeTruthy();
  });

  it('should store username and role on login', () => {
    service.logIn('testUser', true);
    expect(localStorage.getItem('username')).toBe('testUser');
    expect(localStorage.getItem('role')).toBe('editor');
  });

  it('should remove username and role on logout', () => {
    localStorage.setItem('username', 'testUser');
    localStorage.setItem('role', 'editor');
    service.logOut();
    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

});
