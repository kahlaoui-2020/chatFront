import { TestBed } from '@angular/core/testing';

import { ChatDbService } from './chat.db.service';

describe('Chat.DbService', () => {
  let service: ChatDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
