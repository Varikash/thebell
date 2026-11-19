import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('renders the header and the home page', () => {
    const fixture = TestBed.createComponent(App);
    TestBed.tick();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('tb-site-header')).not.toBeNull();
    expect(el.querySelector('tb-home-page')).not.toBeNull();
  });
});
