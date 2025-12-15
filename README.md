# Portfolio Tracker

## 서비스 개요

### 서비스 목적

단순히 현재 자산 가치만 나열하는 기존 대시보드를 넘어, 사용자의 실제 트랜잭션(매수/매도 기록)을 기반으로 정확한 성과를 분석하고, 목표 포트폴리오 달성을 위한 구체적인 리밸런싱 액션을 제안하는 스마트 자산 관리 대시보드

### 서비스 타깃

- 주식, 암호화폐 등 다양한 자산군 분산 투자하고 있는 투자자
- 잦은 매매로 인해 정확한 평단가와 실현 손익 계산이 힘든 투자자
- 설정한 목표 비중에 맞춰 기계적인 리밸런싱을 하고 싶은 투자자

### 핵심 가치

- 매매 기록 데이터를 바탕으로 계산된 신뢰할 수 있는 평단가 및 손익 정보를 제공.
- 얼마나 사고팔아야 하는지" 구체적인 행동 지침을 제공.
- 주식 관련 소식을 제공하여 결정에 도움을 제공

## 주요 기능

1. **자산 관리**
   - 주식, 암호화폐 등 다양한 자산군 지원
   - 사용자가 직접 매수/매도 트랜잭션 기록 입력
   - 실시간 시세 연동을 통한 자산 가치 계산

2. **성과 분석**
   - 트랜잭션 기반 평단가 및 실현 손익 계산
   - 기간별 수익률 및 성과 요약 제공
   - 자산별 비중 차트 시각화

3. **리밸런싱 제안**
   - 목표 포트폴리오 비중 설정 기능
   - 현재 비중과 목표 비중 비교 분석
   - 구체적인 매수/매도 액션 제안

## 데모 영상

## 기술 스택

**백엔드**

- Web Server: uvicorn
- Framework: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy

**프론트엔드**

- Framework: React
- Routing: React Router
- State Management: React Context API
- Charting Library: Recharts
- Styling: Tailwind CSS

## 설치 및 실행

### 1. 실행

```bash
docker-compose up --build
```

### 2. 접속

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. 종료

```bash
docker-compose down
```