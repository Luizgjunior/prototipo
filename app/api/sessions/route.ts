import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaySession = await prisma.session.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: today
        }
      }
    })

    return NextResponse.json(todaySession || { focusMinutes: 0, cyclesCompleted: 0 })
  } catch (error) {
    console.error('Erro ao buscar sessão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { focusMinutes, cyclesCompleted } = await request.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Buscar sessão de hoje ou criar nova
    let todaySession = await prisma.session.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: today
        }
      }
    })

    if (todaySession) {
      // Atualizar sessão existente
      todaySession = await prisma.session.update({
        where: { id: todaySession.id },
        data: {
          focusMinutes: todaySession.focusMinutes + (focusMinutes || 0),
          cyclesCompleted: todaySession.cyclesCompleted + (cyclesCompleted || 0)
        }
      })
    } else {
      // Criar nova sessão
      todaySession = await prisma.session.create({
        data: {
          userId: session.user.id,
          focusMinutes: focusMinutes || 0,
          cyclesCompleted: cyclesCompleted || 0
        }
      })
    }

    return NextResponse.json(todaySession)
  } catch (error) {
    console.error('Erro ao salvar sessão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
