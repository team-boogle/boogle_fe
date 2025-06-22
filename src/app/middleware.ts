// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. 사용자의 로그인 상태를 확인할 인증 토큰을 쿠키에서 가져옵니다.
  //    (실제 사용하는 쿠키 이름으로 변경하세요. 예: 'session-token', 'access-token')
  const sessionToken = request.cookies.get('session-token')?.value;

  // 2. 현재 요청 경로와 사용자의 로그인 상태를 변수로 정의합니다.
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!sessionToken;

  // 3. 보호할 경로와 공개할 경로 목록을 정의합니다.
  const protectedRoutes = ['/game']; // '/game' 및 하위 경로를 보호
  const publicRoutes = ['/', '/signup']; // 시작 페이지와 회원가입 페이지는 공개

  const isOnProtectedRoute = protectedRoutes.some(path => pathname.startsWith(path));
  const isOnPublicRoute = publicRoutes.includes(pathname);

  // --- 리디렉션 규칙 ---

  // 규칙 1: 로그인하지 않은 사용자가 보호된 페이지에 접근하려는 경우
  if (isOnProtectedRoute && !isLoggedIn) {
    // 시작 페이지로 리디렉션합니다.
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 규칙 2: 이미 로그인한 사용자가 공개된 페이지(시작, 회원가입)에 접근하려는 경우
  if (isOnPublicRoute && isLoggedIn) {
    // 게임 페이지로 리디렉션합니다.
    return NextResponse.redirect(new URL('/game', request.url));
  }

  // 4. 위 규칙에 해당하지 않으면 요청을 그대로 통과시킵니다.
  return NextResponse.next();
}

// 5. 미들웨어가 실행될 경로를 지정합니다.
//    (API, 정적 파일, 이미지 파일 등은 제외하여 불필요한 실행을 방지)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
