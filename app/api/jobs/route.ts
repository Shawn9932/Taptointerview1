import { NextResponse } from 'next/server'; import { Store } from '../../../shared/store'; export async function GET(){return NextResponse.json({ jobs: Store.jobs });}
