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

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isPriority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error)
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

    const { title, isPriority = false } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Título da tarefa é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se já existem 3 prioridades
    if (isPriority) {
      const priorityCount = await prisma.task.count({
        where: {
          userId: session.user.id,
          isPriority: true,
          status: { not: 'DONE' }
        }
      })

      if (priorityCount >= 3) {
        return NextResponse.json(
          { error: 'Máximo de 3 prioridades por dia' },
          { status: 400 }
        )
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        isPriority,
        userId: session.user.id,
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
